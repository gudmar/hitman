// const levelUp = () => {
//     emitEvent({ eventName: LEVEL_UP_EVENT })
// }
// const levelDown = () => {
//     emitEvent({ eventName: LEVEL_DOWN_EVENT})
// }
// const setLevel = (newLevel) => {
//     emitEvent({ eventName: CURRENT_LEVEL_IS_EVENT, info: newLevel})
// }

const getParameterSetters = ({
    parameterUpEventName,
    parameterDownEventName,
    setParameterEventName,
}) => {
    const parameterUp = () => {
        emitEvent({ eventName: parameterUpEventName })
    }
    const parameterDown = () => {
        emitEvent({ eventName: parameterDownEventName })
    }
    const setParameter = (newValue) => {
        emitEvent({ eventName: setParameterEventName, info: newValue })
    }
    return {
        parameterUp, parameterDown, setParameter
    }
}

const {
    parameterUp: levelUp,
    parameterDown: levelDown,
    setParameter: setLevel,
} = getParameterSetters({
    parameterUpEventName: LEVEL_UP_EVENT,
    parameterDownEventName: LEVEL_DOWN_EVENT,
    setParameterEventName: CURRENT_LEVEL_IS_EVENT,
})

const {
    parameterUp: speedUp,
    parameterDown: speedDown,
    setParameter: setSpeed,
} = getParameterSetters({
    parameterUpEventName: SPEED_UP_EVENT,
    parameterDownEventName: SPEED_DOWN_EVENT,
    setParameterEventName: CURRENT_SPEED_IS_EVENT,
})


const getGlobalNumberParameterHandler = ({
    startValue,
    parameterUpEventName,
    parameterDownEventName,
    setParameterEventName,
    maxValue,
    minValue,
}) => () => {
    let parameter = startValue;
    rxjs.fromEvent(document, parameterUpEventName).subscribe(() => {
        if (parameter === maxValue) return;
        parameter = parameter + 1;
        emitEvent({ eventName: setParameterEventName, info: parameter})
    })
    rxjs.fromEvent(document, parameterDownEventName).subscribe(() => {
        if (parameter === minValue) return;
        parameter = parameter - 1;
        emitEvent({ eventName: setParameterEventName, info: `${parameter}` })
    })
    rxjs.fromEvent(document, setParameterEventName).subscribe((e) => {
        parameter = e.detail;
    })
    return parameter
}

const getGlobalBooleanParameterHandler = ({
    startValue,
    toggleEventName,
    optionalSetEventName,
    optionalClearEventName,
    parameterName,
}) => () => {
    let parameter = startValue;
    const subscribers = {};
    const subscribe = ({subscribtionId, callback}) => {
        subscribers[subscribtionId] = callback;
    }
    const unsubscribe = ({subscribtionId}) => {
        delete subscribers[subscribtionId]
    }
    const runAllSubscribtions = (newValue) => {
        const subscribtions = Object.values(subscribers);
        subscribtions.forEach((subscribtion) => subscribtion(newValue))
    }

    rxjs.fromEvent(document, toggleEventName)
    .subscribe(() => {
        parameter = !parameter;
        runAllSubscribtions(parameter)
    })
    if (optionalSetEventName) {
        rxjs.fromEvent(document, optionalSetEventName).subscribe(() => {
            parameter = true;
            runAllSubscribtions(parameter)
        })
    }
    if (optionalClearEventName) {
        rxjs.fromEvent(document, optionalClearEventName).subscribe(() => {
            parameter = false;
            runAllSubscribtions(parameter)
        })
    }
    return { [parameterName]: parameter, [`${parameterName}Subscribe`]: subscribe, [`${parameterName}Unsubscribe`]: unsubscribe };
}

const handleLevelGlobalState = getGlobalNumberParameterHandler({
    startValue: START_LEVEL,
    parameterUpEventName: LEVEL_UP_EVENT,
    parameterDownEventName: LEVEL_DOWN_EVENT,
    setParameterEventName: CURRENT_LEVEL_IS_EVENT,
    maxValue: 7,
    minValue: 0,
})

const handleSpeedGlobalState = getGlobalNumberParameterHandler({
    startValue: START_SPEED,
    parameterUpEventName: SPEED_UP_EVENT,
    parameterDownEventName: SPEED_DOWN_EVENT,
    setParameterEventName: CURRENT_SPEED_IS_EVENT,
    maxValue: 8,
    minValue: 0
})

const handlePauseGlobalState = getGlobalBooleanParameterHandler({
    startValue: false,
    toggleEventName: TOGGLE_PAUSE_EVENT,
    parameterName: 'isPaused'
})

const handleGameLostGlobalState = getGlobalBooleanParameterHandler({
    startValue: false,
    toggleEventName: 'not available',
    optionalSetEventName: GAME_LOST_EVENT,
    parameterName: 'isGameLost'
})

const StateKeeper = () => {
    const level = handleLevelGlobalState();
    const speed = handleSpeedGlobalState();
    const isPausedWithSubscribtion = handlePauseGlobalState();
    const isGameLostWithSubscribtion = handleGameLostGlobalState();

    const state = {
        level, speed, isPausedWithSubscribtion, isGameLostWithSubscribtion
    }
    Backdrop(
        {
            renders: StartGame,
            parentId: ROOT_ID,
            globalState: state,
        }
    )
    ScoreBar({level, speed, isPausedWithSubscribtion, isPaused: isPausedWithSubscribtion.isPaused});
    GameCanvas({parentId: ROOT_ID, gameState: state})
    GameLost()
}