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
    workspace.registerToolboxCategoryCallback("blocks", () => {
        let blockList = []

        if (window.blocks && Object.keys(window.blocks).length >= 1) {
            for (let blockId of Object.keys(window.blocks)) {
                let node = document.createElement('block')
                node.setAttribute('type', 'blocks_execute')
                let mutation = document.createElement('mutation')
                mutation.setAttribute('blockId', blockId)
                node.appendChild(mutation)

                blockList.push(node)
            }

            blockList.push(createExtendableElement("sep")
                .setAttribute('gap', '48'))
            blockList.push(createExtendableElement("block")
                .setAttribute('type', 'blocks_return'))
        }

        return blockList;
    });
};