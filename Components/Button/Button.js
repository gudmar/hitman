

const DISABLE_VARIANT_TO_CLASS_MAP = {
    [BUTTON_OUTLINED]: 'disabled-button-outlined',
    [BUTTON_TEXT]: 'disabled-button-text'
}

const VARIANT_TO_CLASS_MAP = {
    [BUTTON_OUTLINED]: 'button-outlined',
    [BUTTON_TEXT]: 'button-text'
}

const SIZE_TO_CLASS_MAP = {
    [BUTTON_TINY]: 'button-tiny',
    [BUTTON_NORMAL_SIZE]: 'button-normal-size'
}

const Button = ({
        parentId,
        buttonId,
        caption,
        classes,
        callback,
        variant,
        size
    }) => {
    let removeButton = () => {};
    let isDisabled = false;
    const thisVariant = variant || BUTTON_OUTLINED;
    const thisSize = size || BUTTON_NORMAL_SIZE
    const variantClass = VARIANT_TO_CLASS_MAP[thisVariant];
    const sizeClass = SIZE_TO_CLASS_MAP[thisSize];
    const disableButton = () => {
        button.classList.add(DISABLE_VARIANT_TO_CLASS_MAP[thisVariant]);
        isDisabled = true;
    }
    const enableButton = () => {
        button.classList.remove(DISABLE_VARIANT_TO_CLASS_MAP[thisVariant])
        isDisabled = false;
    }
    const button = document.createElement('div');
    button.classList.add('button');
    button.classList.add(variantClass);
    button.classList.add(sizeClass);
    if (buttonId) { button.id  = buttonId };
    button.innerHTML = caption;
    if (classes) addClassesToElement(button, classes)
    if (parentId) {
        const parent = document.getElementById(parentId);
        removeButton = () => { parent.remove();}
        parent.append(button)
    }
    const callbackDecoratedWithDisable = () => {
        if (!isDisabled) callback();
    }
    if (callback) {
        const subscribtion = rxjs.fromEvent(button, 'click').subscribe(callbackDecoratedWithDisable);
        const removeWithUnsubscribe = () => {
            
            subscribtion.unsubscribe();
            removeButton();
        }
        removeButton = removeWithUnsubscribe
    }
    return { enableButton, disableButton, button, removeButton };
}