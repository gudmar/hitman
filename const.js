// GAME PARAMS
const STARTING_POINTS = 100;
const LOW_POINTS_ALERT = 40;
const HIT_POINTS = 10;
const MISSED_POINTS = -100;
const GAME_OVER_TIME_S = 60;
const ALERT_TIME = 10;
const START_LEVEL = 0;
const START_SPEED = 0;
const CREATE_TARGET_INTERVAL = 1000;

const MAX_LEVEL = 7;

//BUTTON_VARIANTS
const BUTTON_TEXT = 'text';
const BUTTON_OUTLINED = 'outlined';
const BUTTON_TINY = 'tiny-size';
const BUTTON_NORMAL_SIZE = 'normal-size';

// NOT CHANGEBLE CONST
const MS_IN_S = 1000;
const SEC = 1000;
const TIK = 1;

// IDs
const ROOT_ID = 'root-id'
const SCORE_BAR_WRAPPER_ID = 'score-bar-wrapper-id'
const SCORE_BAR_CONTAINER_ID = 'score-bar-container-id'
const GAME_CANVAS_ID = 'game-canvas-id'
const GAME_START_HORIZONTAL_ID = 'game-start-horizontal-id'

const OBSERVABLES_ID = 'observables'
const OBSERVABLES_NEW_ID = 'observables with new'
const OBSERBABLES_CREATE_ID = 'observables with create'
const OBSERVABLES_FROM = 'observables from'
const OBSERVABLES_OF = 'observables of'
const OBSERVABLES_FROM_EVENT = 'observables fromEvent'
const FROM_EVENT_BUTTON = 'from event button'
const TRASH_1 = 'trash 1'

// EVENT NAMES

const GAME_OVER_TIME_EVENT = 'game-over-time-event';
const GAME_OVER_EVENT = 'game-over-event';
const UPDATE_SCORE_EVENT = 'update-score-event';
const HIT_SCORE_EVENT = 'hit-score-event';
const MISSED_SCORE_EVENT = 'missed-score-event';

const LEVEL_UP_EVENT = 'level-up-event';
const LEVEL_DOWN_EVENT = 'level-down-event';
const CURRENT_LEVEL_IS_EVENT = 'current-level-is-event';
const START_GAME_EVENT = 'start-game-event';
const GAME_LOST_EVENT = 'game-lost-event'

const CURRENT_SPEED_IS_EVENT = 'current-speed-is-event';
const SPEED_DOWN_EVENT = 'speed-down-event';
const SPEED_UP_EVENT = 'spped-up-event';
const PAUSE_GAME_EVENT = 'pause-game-event'
const TOGGLE_PAUSE_EVENT = 'toggle-pause-event'
const CLOCK_TICK_EVENT = 'clock-tick-event';
const MOVE_ALL_TARGETS_EVENT = 'move-all-targets-event'
