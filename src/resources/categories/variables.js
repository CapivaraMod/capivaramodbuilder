const createExtendableElement = (type) => {
    /**
     * @type {HTMLDivElement}
     */
    const element = document.createElement(type);
    const _setAttribute = element.setAttribute;
    const _setAttributeNS = element.setAttributeNS;

    element.setAttribute = (...args) => {
        _setAttribute.call(element, ...args);
        return element;
    };
    element.setAttributeNS = (...args) => {
        _setAttributeNS.call(element, ...args);
        return element;
    };

    element.setInnerHTML = (html) => {
        element.innerHTML = html;
        return element;
    };
    element.setInnerText = (text) => {
        element.innerText = text;
        return element;
    };

    return element;
};

export default (workspace) => {
    // variables
    workspace.registerToolboxCategoryCallback("variables", () => {
        const blockList = [];
        blockList.push(createExtendableElement('button')
            .setAttribute('text', 'Register variable')
            .setAttribute('callbackkey', 'variables_register'))

        if (window.variables && Object.keys(window.variables).length > 0) {
            blockList.push(createExtendableElement('button')
                .setAttribute('text', 'Remove variable')
                .setAttribute('callbackkey', 'variables_remove'))
            blockList.push(createExtendableElement('block')
                .setAttribute('type', 'variables_get'));
            blockList.push(createExtendableElement('block')
                .setAttribute('type', 'variables_set'));
        }

        return blockList;
    });
};