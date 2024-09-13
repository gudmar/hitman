const EndGameInfo = (parentId) => {
    rxjs.fromEvent(document, GAME_OVER_EVENT).pipe(rxjs.take(1), rxjs.tap(() => console.log('Game over')))
        .subscribe({
            next: () => Information('Game over', parentId)
        })
}
