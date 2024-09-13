const GameLost = () => {
    const subscribtion = rxjs.fromEvent(GAME_LOST_EVENT).subscribe(() => {
        const getBackdrop = () => {
            const component = document.createElement('div');
            component.innerHTML = 'GAME LOST'
            return component
        }
        Backdrop({
            renders: getBackdrop
        });
        subscribtion.unsubscribe();
    })
}
