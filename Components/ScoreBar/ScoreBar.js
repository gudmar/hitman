
const ScoreBar = (gameState) => {
    const {isPaused, isPausedSubscribe} = gameState.isPausedWithSubscribtion;
    const wrapper = addClassedDiv(ROOT_ID, 'score-bar-wrapper');
    wrapper.id = SCORE_BAR_WRAPPER_ID;
    const gameTitle = addClassedDiv(SCORE_BAR_WRAPPER_ID, 'score-bar-title');
    gameTitle.innerText = 'HITMAN'
    const gameObjectives = addClassedDiv(SCORE_BAR_WRAPPER_ID, 'score-bar-objectives');
    gameObjectives.innerText = `
        Hit all targets, before they reach ground. You start with ${STARTING_POINTS} points.
        For each hit you get ${HIT_POINTS}, when you let through you get ${MISSED_POINTS}.
        Game ends when you have 0 points left, or after ${GAME_OVER_TIME_S}s
    `
    Clock( { parentId: SCORE_BAR_WRAPPER_ID, subscribeToPause: isPausedSubscribe, isPausedStartValue: isPaused });
    Score(SCORE_BAR_WRAPPER_ID);
    Level(SCORE_BAR_WRAPPER_ID, gameState.level);
    Speed(SCORE_BAR_WRAPPER_ID, gameState.speed);
    const {button: pauseButton} = Button({
        parentId: SCORE_BAR_WRAPPER_ID,
        caption: 'Pause',
        callback: () => emitEvent({eventName: TOGGLE_PAUSE_EVENT})
    })
    isPausedSubscribe({
        callback: (newValue) => {
            pauseButton.innerText = newValue ? 'Unpause' : 'Pause';
        },
        subscribtionId: 'score-bar-pause-button'
    })
    EndGameInfo(SCORE_BAR_WRAPPER_ID);
}
