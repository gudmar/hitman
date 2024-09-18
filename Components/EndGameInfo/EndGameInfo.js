const EndGameInfo = (parentId) => {
    let localScore = STARTING_POINTS;
    const onScoreUpdate = rxjs.fromEvent(document, UPDATE_SCORE_EVENT)
        .subscribe(({detail}) => localScore = detail)
    const onGameOver = rxjs.fromEvent(document, GAME_OVER_EVENT).pipe(rxjs.take(1), rxjs.tap(() => console.log('Game over')))
        .subscribe({
            next: () => {
                Information('Game over', parentId, `<span>Your score: <span class="green-label">${localScore}</span> </span>`);
                onGameOver.unsubscribe();
            }
        })
    const onGameLost = rxjs.fromEvent(document, GAME_LOST_EVENT).pipe(rxjs.take(1))
        .subscribe(() => {
            Information('Game lost', parentId)
        })
}
