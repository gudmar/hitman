const Information = ( message, parentId ) => {
    const definedParentId = parentId || ROOT_ID;
    const infoContainer = addClassedDiv(definedParentId, 'information-container');
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('information-message');
    const closeButton = Button({
        caption: `&times;`,
        classes: 'information-close-button'
    })
    closeButton.innerText
    messageContainer.innerText = message;
    infoContainer.append(messageContainer);
    infoContainer.append(closeButton);
    rxjs.fromEvent(closeButton, 'click').pipe(rxjs.take(1)).subscribe({
        next: () => {
            infoContainer.remove();
        }
    })
}
