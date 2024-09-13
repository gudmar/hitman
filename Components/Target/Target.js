const Target = (level) => {
    if (level < 0 || level > 7) throw new Error('Level should be in range [0..9]')
    const target = document.createElement('div');
    target.classList.add('target');
    target.classList.add(`target-${level + 1}`);
    return target
}

const toPx = (value) => `${value}px`
const toCord = (value) => ({ value, px: toPx(value)})

const getNextY = ({value}) => {
    const nextValue = value + 1;
    return toCord(nextValue);
}

const getParent = () => document.getElementById(GAME_CANVAS_ID);

const getInsideX = ({value}) => {
    const parent = getParent();
    const { width } = parent.getBoundingClientRect();
    if (value > width) return toCord(value - width);
    if (value < 0) return toCord(width - value);
    return toCord(value)
}

const getIsTargetCrashed = (targetHeight) => {
    const parent = getParent();
    const {height, top} = parent.getBoundingClientRect();
    const parentBottmEdge = height + top;
    return ({value}) => {
        const result = parentBottmEdge + window.scrollY - targetHeight <= value;
        return result;    
    }
}

const AMPLITUDE = 10;
const PERIOD = AMPLITUDE * 2;

class SawXCalculator {

}

const LEVEL_TO_GET_NEXT_X_MAP = [
    ({offsetX}) => offsetX, // 0
    ({currentX, currentY, offsetX, offsetY, maxWidth}) => {
        const result = (offsetX + currentY - offsetY) % maxWidth;
        return result;
    },
    ({currentX, currentY, offsetX, offsetY, maxWidth}) => { // 1
        const result = Math.abs((offsetX - currentY - offsetY) % maxWidth);
        return result;
    },
    ({currentX, currentY, offsetX, offsetY, maxHeight}) => { // 2
        const normalizedY = ((currentY) / maxHeight - 1) * Math.PI
        const result = offsetX + (Math.atan(normalizedY) * 100);
        return result;
    },
    ({currentX, currentY, offsetX}) => { // 3
        const SQUARE_PERIOD = 100
        const SQUARE_AMPLITUDE = 25
        const periodHalf = SQUARE_PERIOD / 2;
        const growthInPeriod = currentY % SQUARE_PERIOD;
        const result = growthInPeriod < periodHalf ? offsetX - SQUARE_AMPLITUDE : offsetX + SQUARE_AMPLITUDE;
        return result
    },
    ({ currentX, currentY, offsetX, maxHeight }) => { // 4
        const SAW_AMPLITUDE = 30;
        const SAW_PERIOD = 2*SAW_AMPLITUDE
        const periodNr = Math.floor((currentY / SAW_PERIOD));
        const isEven = periodNr % 2 === 0;
        const fromPeriodStart = currentY - periodNr * SAW_PERIOD
        if (isEven) return offsetX - fromPeriodStart + SAW_AMPLITUDE
        return offsetX + fromPeriodStart - SAW_AMPLITUDE
    },
    ({ currentX, currentY, offsetX }) => { // 5
        const SIN_AMPLITUDE = 30;
        const SIN_PERIOD = 20;
        const result = offsetX + Math.sin(currentY / SIN_PERIOD) * SIN_AMPLITUDE
        return result;
    }, // 6
    ({ currentX, currentY, offsetX }) => {
        const SIN_AMPLITUDE = 30;
        const SIN_PERIOD = 15;
        const result = offsetX + Math.sin(currentY / SIN_PERIOD) * SIN_AMPLITUDE
        return result;
    }, // 7
    ({ currentX, currentY }) => { // 7
        // random change
        const random = Math.random()
        const shouldChangeX = random < 0.005;
        if (!shouldChangeX) return currentX;
        const { width } = getParent().getBoundingClientRect();
        const nextCord = Math.ceil( Math.random() * width);
        return nextCord;
    },
    
]

const getInitialX = () => {
    const { width: parentWidth } = getParent().getBoundingClientRect()
    const result = Math.random() * (parentWidth - 2 * AMPLITUDE) + AMPLITUDE;
    return toCord(result)
}

const getInitialY = () => {
    const { top } = getParent().getBoundingClientRect();
    const result = window.scrollY + top;
    return toCord(result)
}

const adaptNextFunction = (nextFunction) => ({
    currentXCords, currentYCords, offsetX, offsetY, maxHeight, maxWidth
}) => {
    const value = nextFunction({
        currentX: currentXCords.value,
        currentY: currentYCords.value,
        offsetX: offsetX.value,
        offsetY: offsetY.value,
        maxHeight,
        maxWidth,
    });
    return toCord(value);
}

const getRandomNumber = (maxValue) => {
    const result = Math.round(Math.random() * maxValue);
    return result
}

const MovingTarget = (gameState, parentId) => {
    const {level, isPausedWithSubscribtion, isGameLostWithSubscribtion }=gameState;
    const {isPaused: isPausedInitialValue, isPausedSubscribe} = isPausedWithSubscribtion
    const { isGameLost: isGameLostInitialValue, isGameLostSubscribe} = isGameLostWithSubscribtion
    let isPausedLocal = isPausedInitialValue;
    let isGameLostLocal = isGameLostInitialValue;
    isPausedSubscribe({subscribtionId: 'target', callback: (newValue) => isPausedLocal = newValue})
    isGameLostSubscribe({subscribtionId: 'target', callback: (newValue) => isGameLostLocal = newValue})
    const definedParentId = parentId || GAME_CANVAS_ID;
    const parent = document.getElementById(definedParentId);
    const {height: parentHeight, width: parentWidth} = parent.getBoundingClientRect();
    const randomTargetType = getRandomNumber(level);
    const target = Target(randomTargetType);
    const offsetX = getInitialX();
    let x = offsetX;
    let y = getInitialY();
    const offsetY = y;
    target.style.top = y.px;
    target.style.left = x.px;
    document.getElementById(definedParentId).append(target);
    const { height: targetHeight } = target.getBoundingClientRect();
    const isTargetCrashed = getIsTargetCrashed(targetHeight);
    const nextXFunction = adaptNextFunction(LEVEL_TO_GET_NEXT_X_MAP[randomTargetType]);
    const mover = rxjs.fromEvent(document, MOVE_ALL_TARGETS_EVENT);
    const move = mover.subscribe(() => {
            y = getNextY(y);
            x = nextXFunction({
                currentXCords: x,
                currentYCords: y,
                offsetX: offsetX,
                offsetY: offsetY,
                maxHeight: parentHeight,
                maxWidth: parentWidth,
            });
            target.style.top = y.px;
            target.style.left = x.px;
        })
    const miss = mover.subscribe(() => {
        if (isTargetCrashed(y)) {
            emitEvent({ eventName: MISSED_SCORE_EVENT, info: MISSED_POINTS })
            target.remove();
            move.unsubscribe();
            miss.unsubscribe();
        }
    })
    const click = rxjs.fromEvent(target, 'click')
        .pipe(rxjs.take(1))
        .subscribe(() => {
            if (isPausedLocal || isGameLostLocal) return;
            emitEvent({ eventName: HIT_SCORE_EVENT, info: HIT_POINTS });
            move.unsubscribe();
            miss.unsubscribe();
            click.unsubscribe();
            target.remove();
        })
}
