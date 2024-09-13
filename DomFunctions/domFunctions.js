let rootId = ROOT_ID;

const addClassesToElement = (htmlElement, classNames) => {
    if (Array.isArray(classNames)) {
        classNames.forEach((className) => {
            if (typeof className !== 'string') throw new Error ('Class name should be a string')
            htmlElement.classList.add(className);
        })
    } else if (typeof classNames === 'string') {
        htmlElement.classList.add(classNames);
    } else {
        throw new Error('classNames should be a string or array of strings')
    }
}

const addDivToId = (id) => {
    const root = document.getElementById(id);
    const div = document.createElement('div');
    root.append(div);
    return div;
}

const wrap = ({parentId, children, wrappingTag}) => {
    const definedWrappingTag = wrappingTag || 'div'
    try {
        const parent = document.getElementById(parentId);
        const wrapper = document.createElement(definedWrappingTag);
        parent.append(wrapper);
        if (!children) return wrapper;
        if (Array.isArray(children)) {
            children.forEach(() => {
                const childElement = child();
                wrapper.append(childElement);    
            })    
        } else {
            const childElement = children();
            wrapper.append(childElement);
        }
        return wrapper;
    } catch(e) {
        throw new Error(`Cannot create html element ${wrappingTag}`)
    }
}

const addClassedDiv = (parentId, cssClassNames) => {
    const div = addDivToId(parentId);
    if (Array.isArray(cssClassNames)) {
        cssClassNames.forEach(className => {div.classList.add(className)})
    } else if (typeof cssClassNames === 'string') {
        div.classList.add(cssClassNames)
    } else {
        throw new Error('Expected css class names or css class name, as second arg')
    }
    return div;
}

const getClassedDiv = (cssClassNames) => {
    const div = document.createElement('div');
    if (Array.isArray(cssClassNames)) {
        cssClassNames.forEach(className => {div.classList.add(className)})
    } else if (typeof cssClassNames === 'string') {
        div.classList.add(cssClassNames)
    } else {
        throw new Error('Expected css class names or css class name, as second arg')
    }
    return div;
}

const addSectionDivToId = (rootId, sectionId) => {
    const sectionDiv = addDivToId(rootId);
    sectionDiv.id = sectionId;
    sectionDiv.classList.add('section');
}

const addHeaderToId = (id, text) => {
    const div = addDivToId(id);
    div.classList.add('header');
    div.innerText = text;
}

const addTitleToId = (id, text) => {
    const div = addDivToId(id);
    div.classList.add('title');
    div.innerText = text;
}

const addSubtitleToId = (id, text) => {
    const div = addDivToId(id);
    div.classList.add('subtitle');
    div.innerText = text;
}

const addLabelToId = (id, text) => {
    const div = addDivToId(id);
    div.classList.add('caption');
    div.innerText = text;
}

const addErrorToId = (id, text) => {
    const div = addDivToId(id);
    div.classList.add('error');
    div.innerText = text;
}

const getChangeRootId = (newRootId) => () => {
    rootId = newRootId;
}

const getNewPrintingDestination = (id) => () => {
    const div = addDivToId(rootId);
    div.id = id;
    rootId = id;
}

const header = (message) => addHeaderToId(rootId, message)
const title = (message) => addTitleToId(rootId, message);
const subtitle = (message) => addSubtitleToId(rootId, message);
const label = (message) => addLabelToId(rootId, message);
const logError = (message) => addErrorToId(rootId, message);

const addDivWithId = (divId) => {
    const div = addDivToId(rootId);
    div.id = divId
    return div;
}

const provideRoot = (id) => {
    const result = document.getElementById(id);
    if (!result) {
        const newResult = document.createElement('div');
        newResult.id = id;
        const currentRoot = document.getElementById(rootId);
        currentRoot.append(newResult)
        return currentRoot
    }
    return result;
}

// const addButton = ({ parentId, buttonId, caption }) => {
//     const definedButtonId = buttonId || getUuid();
//     const root = provideRoot(parentId)
//     const button = document.createElement('div');
//     button.classList.add('button');
//     button.id = definedButtonId;
//     button.innerHTML = `<span>${caption}</span>`;
//     root.append(button);
//     return button;
// }

const spanInId = (id, message) => {
    const root = provideRoot(rootId)
    const span = document.createElement('span');
    span.classList.add('white-text')
    span.innerHTML = message;
    root.append(span);
}

const dump = async (t, id, title) => {
    getChangeRootId(id);
    subtitle(title);
    await wait(t);
};
