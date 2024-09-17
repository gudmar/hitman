const EndGameInfo = (parentId) => {
    const onGameOver = rxjs.fromEvent(document, GAME_OVER_EVENT).pipe(rxjs.take(1), rxjs.tap(() => console.log('Game over')))
        .subscribe({
            next: () => {
                Information('Game over', parentId);
                onGameOver.unsubscribe();
            }
        })
    const onGameLost = rxjs.fromEvent(document, GAME_LOST_EVENT).pipe(rxjs.take(1))
        .subscribe(() => {
            Information('Game lost', parentId)
        })
}
