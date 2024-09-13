const emitEvent = ({ eventName, target, info }) => {
    const event = new CustomEvent(eventName, {
        bubbles: true,
        cancelable: true,
        detail: info || ''
    });
    (target || document).dispatchEvent(event);
}

// const emitGameOverTimeIfOverTime = (startTimestamp) => {
//     const currentTime = Date.now();
//     const diff = currentTime - startTimestamp;
//     const isGameOverTime = GAME_OVER_TIME_S * MS_IN_S < diff;
//     if (isGameOverTime) {
//         emitEvent({ eventName: GAME_OVER_TIME_EVENT});
//     }
//     return isGameOverTime;
// }
