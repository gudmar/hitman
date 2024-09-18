
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
    const horizontalContainr = addClassedDiv(ROOT_ID, 'score-bar-horizontal-container')
    horizontalContainr.id = SCORE_BAR_CONTAINER_ID
    const {button: pauseButton} = Button({
        parentId: SCORE_BAR_CONTAINER_ID,
        caption: 'Pause',
        callback: () => emitEvent({eventName: TOGGLE_PAUSE_EVENT})
    })
    Clock( { parentId: SCORE_BAR_CONTAINER_ID, subscribeToPause: isPausedSubscribe, isPausedStartValue: isPaused });
    Score(SCORE_BAR_CONTAINER_ID);
    Level(SCORE_BAR_CONTAINER_ID, gameState.level);
    Speed(SCORE_BAR_CONTAINER_ID, gameState.speed);
    isPausedSubscribe({
        callback: (newValue) => {
            pauseButton.innerText = newValue ? 'Unpause' : 'Pause';
        },
        subscribtionId: 'score-bar-pause-button'
    })
    EndGameInfo(SCORE_BAR_WRAPPER_ID);
}
