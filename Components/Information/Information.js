const Information = ( message, parentId ) => {
    const definedParentId = parentId || ROOT_ID;
    const infoContainer = addClassedDiv(definedParentId, 'information-container');
    const messageContainer = document.createElement('div');
    const subMessageContainer = document.createElement('div');
    messageContainer.classList.add('information-message');
    subMessageContainer.classList.add('information-submessage');
    messageContainer.innerText = message;
    subMessageContainer.innerHTML = '<span>Hit <span class="information-shout">F5</span> to restart</span>'
    infoContainer.append(messageContainer);
    infoContainer.append(subMessageContainer);
    const onClick = rxjs.fromEvent(closeButton, 'click').pipe(rxjs.take(1)).subscribe({
        next: () => {
            infoContainer.remove();
            onClick.unsubscribe();
        }
    })
}
