const StartGame = ({unmount, state}) => {
    const containerId = 'start-game-container';
    const container = document.createElement('div');
    container.id = containerId;
    container.classList.add('start-game-wrapper');
    container.id = containerId;
    const thisUnmount = unmount || (() => {});
    const header = getClassedDiv(containerId, 'start-game-header');
    header.innerText = 'Game settings'
    const setLevelComponent = SetLevel(containerId, state.level);
    const setSpeedComponent = SetSpeed(containerId, state.speed);
    const buttons = getClassedDiv(containerId, 'start-game-buttons');
    const buttonsId = containerId + buttons
    buttons.id = buttonsId
    const { button } = Button({
        caption: 'Start game',
        callback: () => {
            emitEvent({eventName: START_GAME_EVENT})
            unmount();
        }
    })
    buttons.append(button);
    container.append(header)
    container.append(setLevelComponent)
    container.append(setSpeedComponent)
    container.append(button);
    return container;
}
