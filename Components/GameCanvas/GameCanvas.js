
const SPPED_TO_DIVIDER_MAP = [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]

const setLocalClock = (speed, callback) => {
    if (speed < 0 || speed > 9) throw new Error('Game speed should be within range [0..9]');
    const localClock = rxjs.fromEvent(document, CLOCK_TICK_EVENT)
        .pipe(
            rxjs.filter(({detail}) => {
                return detail % SPPED_TO_DIVIDER_MAP[speed] === 0
            }),
        )
        .subscribe(callback);
    const endLocalClock = () => localClock.unsubscribe();
    return endLocalClock;
}

const setCreateTarget = (gameState) => {
    const localClock = rxjs.fromEvent(document, CLOCK_TICK_EVENT)
        .pipe(
            rxjs.filter(({detail}) => {
                return detail % (CREATE_TARGET_INTERVAL - gameState.level * 50) === 0
            }),
        )
        .subscribe(getCreateTargets(gameState))
    const endTargetCreation = () => localClock.unsubscribe();
    return endTargetCreation;
}

const getCreateTargets = (gameState) => () => {
    MovingTarget(gameState);
}

const EmitTarget = (gameState) => {
    const {level, speed } = gameState;
    let endLocalClock = setLocalClock(speed, () => {
        emitEvent({eventName: MOVE_ALL_TARGETS_EVENT})
    });
    let createTargets = getCreateTargets(gameState);
    let endTargetCreation = setCreateTarget(gameState);
    let localSpeed = speed;
    const setCurrentLevel = rxjs.fromEvent(document, CURRENT_LEVEL_IS_EVENT)
        .subscribe(({detail}) => {
            createTargets = getCreateTargets({...gameState, level: detail });
            endLocalClock();
            endTargetCreation();
            endTargetCreation = setCreateTarget({...gameState, level: detail });
            endLocalClock = setLocalClock(detail, () => {
                emitEvent({eventName: MOVE_ALL_TARGETS_EVENT})
            });        
        })
    const setCurrentSpeed = rxjs.fromEvent(document, CURRENT_SPEED_IS_EVENT)
        .subscribe(({detail}) => {
            endLocalClock();
            localSpeed = detail;
            endLocalClock = setLocalClock(detail, () => {
                emitEvent({eventName: MOVE_ALL_TARGETS_EVENT})
            });        
        })

    const endTargetEmit = () => {
        setCurrentSpeed.unsubscribe();
        setCurrentLevel.unsubscribe();
        endLocalClock();
        endTargetCreation();
    }
    return endTargetEmit;
}

const GameCanvas = ({
    parentId,
    gameState,
}) => {
    let isGameRunning = false;
    let isGameOver = false;
    let isGameLost = false;
    const canvas = addDivToId(parentId);
    canvas.classList.add('game-canvas');
    canvas.id = GAME_CANVAS_ID;
    const onGameStart = rxjs.fromEvent(document, START_GAME_EVENT).subscribe(() => isGameRunning = true);
    const onGamePause = rxjs.fromEvent(document, PAUSE_GAME_EVENT).subscribe(() => isGameRunning = false)
    const endEmitTarget = EmitTarget(gameState);
    const onGameOver = rxjs.fromEvent(document, GAME_OVER_EVENT).subscribe(() => {
        isGameRunning = false;
        isGameOver = true;
        onGameStart.unsubscribe();
        onGamePause.unsubscribe();
        onGameOver.unsubscribe();
        endEmitTarget();
    });
    const onGameLost = rxjs.fromEvent(document, GAME_LOST_EVENT).subscribe(() => {
        isGameOver = true;
        isGameRunning = false;
        isGameLost = true;
        onGameStart.unsubscribe();
        onGamePause.unsubscribe();
        onGameOver.unsubscribe();
        onGameLost.unsubscribe();
        endEmitTarget();
    })
    
}

const endSubscribtions = () => {
    getCreateTargets().unsubscribe();
}
const onGameLost = rxjs.fromEvent(document, GAME_LOST_EVENT).subscribe(() => {
    endSubscribtions();
    onGameLost.unsubscribe();
})
const onGameOver = rxjs.fromEvent(document, GAME_OVER_EVENT).subscribe(() => {
    endSubscribtions();
    onGameLost.unsubscribe();
    onGameOver.unsubscribe();
})
