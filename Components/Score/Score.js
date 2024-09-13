const Score = (parentId) => {
    let currentPoints = STARTING_POINTS;
    const scoreContainer = addClassedDiv(parentId, 'score-wrapper');
    const updateScore = (newValue) => {
        scoreContainer.innerText = newValue;
    }
    updateScore(STARTING_POINTS)
    const onScoreChange = rxjs.fromEvent(document, UPDATE_SCORE_EVENT)
        .subscribe({
            next: (event) => {
                const pointsProposal = currentPoints + event.detail;
                currentPoints = pointsProposal >= 0 ? pointsProposal : 0;
                updateScore(currentPoints);
                if (currentPoints <= LOW_POINTS_ALERT) {
                    scoreContainer.classList.add('score-alert')
                }
                if (currentPoints > LOW_POINTS_ALERT) {
                    scoreContainer.classList.remove('score-alert')
                }
                if (currentPoints <= 0) emitEvent({eventName: GAME_LOST_EVENT})
            }
        });

    const addHitPoints = rxjs.fromEvent(document, HIT_SCORE_EVENT)
        .subscribe((event) => {
            console.log('HIT');
            const points = event.detail;
            emitEvent({ eventName: UPDATE_SCORE_EVENT, info: points })
        })
    const missedHitPoints = rxjs.fromEvent(document, MISSED_SCORE_EVENT)
        .subscribe((event) => {
            console.log('Missed');
            const points = event.detail;
            
            
            emitEvent({ eventName: UPDATE_SCORE_EVENT, info: points })
        })

    const { button: HitButton } = Button({
        parentId: SCORE_BAR_WRAPPER_ID,
        caption: 'Hit',
        callback: () => emitEvent({ eventName: HIT_SCORE_EVENT, info: HIT_POINTS})
    })

    const { button: MissedButton } = Button({
        parentId: SCORE_BAR_WRAPPER_ID,
        caption: 'Missed',
        callback: () => emitEvent({ eventName: MISSED_SCORE_EVENT, info: MISSED_POINTS})
    })
}
