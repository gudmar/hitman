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
    clock
        .pipe(
            rxjs.filter((v) => {
                // console.log('v', v)
                const result = isClockStarted && !isPaused && v%250 === 0;
                return result;
            }),
            rxjs.scan((accTime, _) => (accTime + SEC), 0),
        )
        .subscribe({
            next: (accTime) => {
                const timeLeft = GAME_OVER_TIME_S - accTime / MS_IN_S;
                if (timeLeft < 0) return;
                updateClock(timeLeft);
                if (accTime > GAME_OVER_TIME_S * MS_IN_S) {
                    emitEvent({ eventName: GAME_OVER_TIME_EVENT});
                }
            },
        })
    clock.pipe(
        rxjs.filter(() => isClockStarted && !isPaused),
        rxjs.scan((acc, t) => { const newAcc = acc + 1; return newAcc})
    ).subscribe((t) => {
        emitEvent({eventName: CLOCK_TICK_EVENT, info: t})
        // console.log('Emiting event ', t) WORKS
    })

    // rxjs.fromEvent(document, CLOCK_TICK_EVENT).subscribe((v) => console.log('Clock tick', v.detail))

    const onClockStart = rxjs.fromEvent(document, START_GAME_EVENT)
        .pipe(rxjs.take(1))
        .subscribe(() => {
            console.log('Starting game')
            isClockStarted = true;
        });
    
    const onEndGame = rxjs.fromEvent(document, GAME_OVER_TIME_EVENT)
        .pipe(rxjs.take(1))
        .subscribe({
            next: () => {
                updateClock(0);
                clock.unsubscribe();
                emitEvent({
                    eventName: GAME_OVER_EVENT,
                })
            }
    })
    const onPause = rxjs.fromEvent(document, PAUSE_GAME_EVENT).subscribe(() => isPaused = !isPaused)
}
