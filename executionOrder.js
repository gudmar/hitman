
const OBSERVABLES_ORDER = [
    () => StateKeeper(),
    // () => header('Observables'),
    // () => title('Creation'),
    // () => addSectionDivToId('root', OBSERVABLES_ID),
    // () => subtitle('With new'),
    // () => presentCreationWithNew(OBSERVABLES_NEW_ID),
    // () => subtitle('With create'),
    // () => presentCreationWithFunction(OBSERBABLES_CREATE_ID),
    // () => subtitle('With from'),
    // () => presentCreationFromArray(OBSERVABLES_FROM),
    // () => subtitle('With of'),
    // () => presentCreationOfArray(OBSERVABLES_OF),
    // () => dump(1000, TRASH_1, 'Await async from previous observables'),
    // () => subtitle('With fromEvent'),
    // () => presentCreationFromEvent(OBSERVABLES_FROM_EVENT, FROM_EVENT_BUTTON, 'Add'),

    // () => title('Animation'),
    // () => animation('Animation root', 'move_')
]

const EXECUTION_ORDER = [
    ...OBSERVABLES_ORDER,
]

