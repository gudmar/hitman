
const SPPED_TO_DIVIDER_MAP = [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]

const setLocalClock = (speed, callback) => {
    if (speed < 0 || speed > 9) throw new Error('Game speed should be within range [0..9]');
    const localClock = rxjs.fromEvent(document, CLOCK_TICK_EVENT)
        .pipe(
            rxjs.filter(({detail}) => {
                return detail % SPPED_TO_DIVIDER_MAP[speed] === 0
            }),
        )
        .subscribe(callback);
    const endLocalClock = () => localClock.unsubscribe();
    return endLocalClock;
}

const setCreateTarget = (level) => {
    console.log('Setting target creation interval')
    const localClock = rxjs.fromEvent(document, CLOCK_TICK_EVENT)
        .pipe(
            rxjs.filter(({detail}) => {
                return detail % CREATE_TARGET_INTERVAL === 0
            }),
        )
        .subscribe(getCreateTargets(level))
    const endTargetCreation = () => localClock.unsubscribe();
    return endTargetCreation;
}

const getCreateTargets = (level) => () => {
    const currentMaxLevel = Math.floor(Math.random() * level)
    MovingTarget(currentMaxLevel);
}

const EmitTarget = ({speed, level}) => {
    let endLocalClock = setLocalClock(speed, () => {
        emitEvent({eventName: MOVE_ALL_TARGETS_EVENT})
    });
    let createTargets = getCreateTargets(level);
    let endTargetCreation = setCreateTarget(level);
    let localSpeed = speed;
    rxjs.fromEvent(document, CURRENT_LEVEL_IS_EVENT)
        .subscribe(({detail}) => {
            createTargets = getCreateTargets(detail);
            endLocalClock();
            endTargetCreation();
            endTargetCreation = setCreateTarget(detail);
            endLocalClock = setLocalClock(detail, () => {
                emitEvent({eventName: MOVE_ALL_TARGETS_EVENT})
            });        
        })
    rxjs.fromEvent(document, CURRENT_SPEED_IS_EVENT)
        .subscribe(({detail}) => {
            endLocalClock();
            localSpeed = detail;
            endLocalClock = setLocalClock(detail, () => {
                emitEvent({eventName: MOVE_ALL_TARGETS_EVENT})
            });        
        })
}

const GameCanvas = ({
    parentId,
    gameState,
}) => {
    let isGameRunning = false;
    let isGameOver = false;
    const canvas = addDivToId(parentId);
    canvas.classList.add('game-canvas');
    canvas.id = GAME_CANVAS_ID;
    rxjs.fromEvent(document, START_GAME_EVENT).subscribe(() => isGameRunning = true);
    rxjs.fromEvent(document, PAUSE_GAME_EVENT).subscribe(() => isGameRunning = false)
    rxjs.fromEvent(document, GAME_OVER_TIME_EVENT).subscribe(() => {
        isGameRunning = false;
        isGameOver = true;
    });
    EmitTarget(gameState);
}