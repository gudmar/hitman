const getParameter = ({parameterName, setParameterValueEventName}) => (parentId, startValue) => {
    const parameterContainer = addClassedDiv(parentId, 'parameter-wrapper');
    const parameterContainerId = `${parentId}-${parameterName}-container`
    parameterContainer.id = parameterContainerId;
    parameterContainer.innerHTML = `<span class="parameter-green">${parameterName}</span>`
    const parameterValue = addClassedDiv(parameterContainerId, 'parameter-value')
    
    
    parameterValue.innerText = startValue;
    rxjs.fromEvent(document, setParameterValueEventName).subscribe((e) => {
        const newValue = e.detail;
        parameterValue.innerText = newValue;
    })
}

const getSetParameter = ({
    parameterName,
    parameterUpEventName,
    parameterDownEventName,
    setParameterValueEventName,
}) => (parentId, startValue) => {
    const parameterContainer = getClassedDiv(['parameter-wrapper', 'set-parameter-wrapper']);
    const containerId = `${parentId}-set-${parameterName}-container`;
    parameterContainer.innerHTML = `<span class="parameter-green">${parameterName}</span>`
    parameterContainer.id = containerId;
    const parameterValue = getClassedDiv('parameter-value')
    const buttons = getClassedDiv('parameter-buttons');
    const buttonsId = `parentId-${parameterName}-buttons`
    buttons.id = buttonsId;
    parameterValue.innerText = startValue;
    const {button: ParameterUpButton} = Button({
        caption: '+',
        callback: () => emitEvent({ eventName: parameterUpEventName }),
        variant: BUTTON_TEXT,
        size: BUTTON_TINY
    })
    const {button: ParameterDownButton, disableButton: disableParameterDown, enableButton: enableParameterDown} = Button({
        caption: '-',
        callback: () => emitEvent({ eventName: parameterDownEventName }),
        variant: BUTTON_TEXT,
        size: BUTTON_TINY
    })
    buttons.append(ParameterUpButton);
    buttons.append(ParameterDownButton);
    rxjs.fromEvent(document, setParameterValueEventName).subscribe((e) => {
        const newValue = e.detail;
        parameterValue.innerText = newValue;
        if (newValue <= 0) disableParameterDown();
        if (newValue > 0) enableParameterDown();
    })
    parameterContainer.append(parameterValue);
    parameterContainer.append(buttons);
    return parameterContainer;
}


const Level = getParameter({parameterName: 'level', setParameterValueEventName: CURRENT_LEVEL_IS_EVENT});

const SetLevel = getSetParameter({
    parameterName: 'level',
    setParameterValueEventName: CURRENT_LEVEL_IS_EVENT,
    parameterDownEventName: LEVEL_DOWN_EVENT,
    parameterUpEventName: LEVEL_UP_EVENT,
})

const Speed = getParameter({parameterName: 'speed', setParameterValueEventName: CURRENT_SPEED_IS_EVENT});

const SetSpeed = getSetParameter({
    parameterName: 'speed',
    setParameterValueEventName: CURRENT_SPEED_IS_EVENT,
    parameterDownEventName: SPEED_DOWN_EVENT,
    parameterUpEventName:   SPEED_UP_EVENT,
})

