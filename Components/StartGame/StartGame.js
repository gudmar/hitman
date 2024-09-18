const StartGame = ({unmount, state}) => {
    const wrapperId = 'start-game-wrapper';
    const wrapper = document.createElement('div');
    wrapper.id = wrapperId;
    wrapper.classList.add('start-game-wrapper');
    wrapper.id = wrapperId;
    const thisUnmount = unmount || (() => {});
    const header = getClassedDiv(wrapperId, 'start-game-header');
    const horizontalContainer = getClassedDiv(wrapperId, 'horizontal-container')
    horizontalContainer.id = GAME_START_HORIZONTAL_ID;
    header.innerText = 'Game settings'
    
    const setLevelComponent = SetLevel(wrapperId+'level', state.level);
    const setSpeedComponent = SetSpeed(wrapperId+'speed', state.speed);
    const buttons = getClassedDiv(wrapperId, 'start-game-buttons');
    const buttonsId = wrapperId + buttons
    buttons.id = buttonsId
    const { button } = Button({
        caption: 'Start game',
        callback: () => {
            emitEvent({eventName: START_GAME_EVENT})
            unmount();
        }
    })
    buttons.append(button);
    wrapper.append(header)
    wrapper.append(horizontalContainer)
    horizontalContainer.append(setLevelComponent)
    horizontalContainer.append(setSpeedComponent)
    wrapper.append(button);
    return wrapper;
}
