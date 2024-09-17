const Clock = ({ parentId, subscribeToPause, isPausedStartValue }) => {
    let isPaused = isPausedStartValue
    let isClockStarted = false;
    const clockContainer = addClassedDiv(parentId, 'clock-wrapper');
    clockContainer.innerText = GAME_OVER_TIME_S;
    const updateClock = (newValue) => {
        clockContainer.innerText = newValue;
    }

    subscribeToPause({subscribtionId: 'clock', callback: (newValue) => isPaused = newValue})
    const clock = rxjs.interval(TIK)
    const subscribedClock = clock
        .pipe(
            rxjs.filter((v) => {
                const result = isClockStarted && !isPaused && v%250 === 0;
                return result;
            }),
            rxjs.scan((accTime, _) => (accTime + SEC), 0),
        )
        .subscribe({
            next: (accTime) => {
                const timeLeft = GAME_OVER_TIME_S - accTime / MS_IN_S;
                if (timeLeft < 0) {
                    emitEvent({ eventName: GAME_OVER_EVENT});
                    updateClock(0);
                    subscribedClock.unsubscribe();
                };
                updateClock(timeLeft);
            },
        })
    clock.pipe(
        rxjs.filter(() => isClockStarted && !isPaused),
        rxjs.scan((acc, t) => { const newAcc = acc + 1; return newAcc})
    ).subscribe((t) => {
        emitEvent({eventName: CLOCK_TICK_EVENT, info: t})
    })

    const onClockStart = rxjs.fromEvent(document, START_GAME_EVENT)
        .pipe(rxjs.take(1))
        .subscribe(() => {
            isClockStarted = true;
        });
    const onPause = rxjs.fromEvent(document, PAUSE_GAME_EVENT).subscribe(() => isPaused = !isPaused)
    const onGameLost = rxjs.fromEvent(document, GAME_LOST_EVENT).pipe(
        rxjs.take(1)
    ).subscribe(() => {
        subscribedClock.unsubscribe();
        onGameLost.unsubscribe();
        onClockStart.unsubscribe();
        onPause.unsubscribe();
    })
}
