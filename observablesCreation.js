
const presentCreationWithNew = async (destinationId) => {
    const observable = new rxjs.Observable((subscriber) => {
        console.log('In observable')
        for(let i = 0; i < 10; i++) {
            subscriber.next(i)
        }
        setTimeout(() => subscriber.next('last value'), 100)
        setTimeout(() => subscriber.next('[ this value is after completion, should not appear ]'), 180)
        setTimeout(() => subscriber.complete(), 150)
    })

    await getShowResultInSpan(destinationId, observable, 'new');
}

const presentCreationWithFunction = async (destinationId) => {
    // This seems an alias to new Observable
    const observable = rxjs.Observable.create((subscriber) => {
        for(let i = 0; i < 10; i++) {
            subscriber.next(i)
        }
        setTimeout(() => subscriber.next('last value'), 100)
        setTimeout(() => subscriber.next('[ this value is after completion, should not appear ]'), 180)
        setTimeout(() => subscriber.complete(), 150)
    })

    await getShowResultInSpan(destinationId, observable, 'funct');
}

const presentCreationFromArray = async (destinationId) => {
    const observable = rxjs.from([0, 1, 2, 3, 4]).pipe(rxjs.map(v => 1.25*v))
    await getShowResultInSpan(destinationId, observable, 'from');
}

const presentCreationOfArray = async (destinationId) => {
    const observable = rxjs.of(0, 1, 2, 3, 4).pipe(rxjs.map(v => `of: ${v}`))
    await getShowResultInSpan(destinationId, observable, 'of');
}


const presentCreationFromEvent = async (destinationId, buttonId, buttonCaption) => {
    addButton(destinationId, buttonId, buttonCaption);
    const button = document.getElementById(buttonId);
    const observable = rxjs.fromEvent(button, 'click').pipe(rxjs.count((value, index) => spanInId(destinationId, index), () => console.log('Pipe works')));
    const s =observable.subscribe({
        next: (v) => {spanInId('Subscribe got next value')},
    })
};

const animation = (destinationId, animatedId) => {
    const addAnimationButtonId = destinationId + 'AddButton'
    const root = provideRoot(destinationId);
    const addAnimationButton = addButton(destinationId, addAnimationButtonId, 'Add animation');
    const addAnimationObservable = rxjs
        .fromEvent(addAnimationButton, 'click')
        .pipe(
            rxjs.tap((v) => console.log(v)),
            rxjs.scan((acc, _) => acc + 1, 0),
            rxjs.tap((v) => console.log(v)),
            rxjs.map(index => {
                console.log('mapping')
                const thisAnimationId = animatedId + index;
                const animated = addButton(destinationId, thisAnimationId, 'Moving button');
                const killAnimatedObservable = rxjs.fromEvent(animated, 'click').subscribe(v => {
                    const element = document.getElementById(thisAnimationId);
                    element.remove();
                })
                animated.style.position = 'relative';
                root.append(animated);
                const observable = rxjs.interval(10).subscribe(v => {
                    animated.style.left = `${v}px`
                    animated.style.bottom = `${Math.sin(v/10) * 50}px`
                    animated.innerText = v
                });
                setTimeout(() => observable.unsubscribe(), 10000);
            })
        )
        .subscribe(() => console.log('Animation created'));
    // rxjs.fromEvent(addAnimationButton, addAnimationObservable).subscribe({
    //     next: () => console.log('Animation added')
    // });
}
