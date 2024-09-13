const Backdrop = ( {
    renders, parentId, globalState
}) => {
    const definedParentId = parentId || ROOT_ID;
    const backdropContainer = addClassedDiv(definedParentId, 'backdrop-container');
    const contentContainer = document.createElement('div');
    backdropContainer.append(contentContainer)
    contentContainer.classList.add('backdrop-content');
    const removeFunction = () => backdropContainer.remove()
    const startGameComponent = renders({ unmount: removeFunction, state: globalState });
    contentContainer.append(startGameComponent)
    return backdropContainer;
}
