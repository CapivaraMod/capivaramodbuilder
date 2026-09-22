import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';

const categoryPrefix = 'looks_';
const categoryColor = '#9966ff';

const TARGET = `(Scratch.vm.runtime.getEditingTarget() || Scratch.vm.runtime.targets.find(t => !t.isStage))`;
const STAGE = `Scratch.vm.runtime.getTargetForStage()`;
const LOOKS = `Scratch.vm.runtime.ext_scratch3_looks`;

const effects = [
    ["color", "color"],
    ["fisheye", "fisheye"],
    ["whirl", "whirl"],
    ["pixelate", "pixelate"],
    ["mosaic", "mosaic"],
    ["brightness", "brightness"],
    ["ghost", "ghost"]
];

function numberField(name, value) {
    return {
        "type": "field_number",
        "name": name,
        "check": "Number",
        "value": value,
        "acceptsBlocks": true
    };
}

function textField(name, text) {
    return {
        "type": "field_input",
        "name": name,
        "check": null,
        "text": text,
        "acceptsBlocks": true
    };
}

function register() {
    registerBlock(`${categoryPrefix}say`, {
        message0: 'say %1',
        args0: [textField('MESSAGE', 'Hello!')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const MESSAGE = javascriptGenerator.valueToCode(block, 'MESSAGE');
        const code = `${LOOKS}.say({ MESSAGE: ${MESSAGE} }, { target: ${TARGET} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}sayfor`, {
        message0: 'say %1 for %2 seconds',
        args0: [textField('MESSAGE', 'Hello!'), numberField('SECS', 2)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const MESSAGE = javascriptGenerator.valueToCode(block, 'MESSAGE');
        const SECS = javascriptGenerator.valueToCode(block, 'SECS');
        const code = `await ${LOOKS}.sayforsecs({ MESSAGE: ${MESSAGE}, SECS: ${SECS} }, { target: ${TARGET} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}think`, {
        message0: 'think %1',
        args0: [textField('MESSAGE', 'Hmm...')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const MESSAGE = javascriptGenerator.valueToCode(block, 'MESSAGE');
        const code = `${LOOKS}.think({ MESSAGE: ${MESSAGE} }, { target: ${TARGET} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}thinkfor`, {
        message0: 'think %1 for %2 seconds',
        args0: [textField('MESSAGE', 'Hmm...'), numberField('SECS', 2)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const MESSAGE = javascriptGenerator.valueToCode(block, 'MESSAGE');
        const SECS = javascriptGenerator.valueToCode(block, 'SECS');
        const code = `await ${LOOKS}.thinkforsecs({ MESSAGE: ${MESSAGE}, SECS: ${SECS} }, { target: ${TARGET} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}switchcostume`, {
        message0: 'switch costume to %1',
        args0: [textField('COSTUME', 'costume1')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const COSTUME = javascriptGenerator.valueToCode(block, 'COSTUME');
        const code = `${LOOKS}.switchCostume({ COSTUME: ${COSTUME} }, { target: ${TARGET} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}nextcostume`, {
        message0: 'next costume',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `${LOOKS}.nextCostume({}, { target: ${TARGET} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}switchbackdrop`, {
        message0: 'switch backdrop to %1',
        args0: [textField('BACKDROP', 'backdrop1')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BACKDROP = javascriptGenerator.valueToCode(block, 'BACKDROP');
        const code = `${LOOKS}.switchBackdrop({ BACKDROP: ${BACKDROP} }, { target: ${STAGE} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}nextbackdrop`, {
        message0: 'next backdrop',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `${LOOKS}.nextBackdrop({}, { target: ${STAGE} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}changesize`, {
        message0: 'change size by %1',
        args0: [numberField('CHANGE', 10)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CHANGE = javascriptGenerator.valueToCode(block, 'CHANGE');
        const code = `(() => { const t = ${TARGET}; t.setSize(t.size + ${CHANGE}); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}setsize`, {
        message0: 'set size to %1 %%',
        args0: [numberField('SIZE', 100)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SIZE = javascriptGenerator.valueToCode(block, 'SIZE');
        const code = `${TARGET}.setSize(${SIZE});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}changeeffect`, {
        message0: 'change %1 effect by %2',
        args0: [
            {
                "type": "field_dropdown",
                "name": "EFFECT",
                "options": effects
            },
            numberField('CHANGE', 25)
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECT = block.getFieldValue('EFFECT');
        const CHANGE = javascriptGenerator.valueToCode(block, 'CHANGE');
        const code = `(() => { const t = ${TARGET}; t.setEffect("${EFFECT}", (t.effects["${EFFECT}"] || 0) + ${CHANGE}); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}seteffect`, {
        message0: 'set %1 effect to %2',
        args0: [
            {
                "type": "field_dropdown",
                "name": "EFFECT",
                "options": effects
            },
            numberField('VALUE', 0)
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECT = block.getFieldValue('EFFECT');
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE');
        const code = `${TARGET}.setEffect("${EFFECT}", ${VALUE});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}cleareffects`, {
        message0: 'clear graphic effects',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `${TARGET}.clearEffects();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}show`, {
        message0: 'show',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `${TARGET}.setVisible(true);`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}hide`, {
        message0: 'hide',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `${TARGET}.setVisible(false);`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}gotolayer`, {
        message0: 'go to %1 layer',
        args0: [
            {
                "type": "field_dropdown",
                "name": "LAYER",
                "options": [
                    ["front", "goToFront"],
                    ["back", "goToBack"]
                ]
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const LAYER = block.getFieldValue('LAYER');
        const code = `${TARGET}.${LAYER}();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}golayers`, {
        message0: 'go %1 %2 layers',
        args0: [
            {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    ["forward", "goForwardLayers"],
                    ["backward", "goBackwardLayers"]
                ]
            },
            numberField('NUM', 1)
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const DIRECTION = block.getFieldValue('DIRECTION');
        const NUM = javascriptGenerator.valueToCode(block, 'NUM');
        const code = `${TARGET}.${DIRECTION}(${NUM});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}costumenumber`, {
        message0: 'costume number',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(${TARGET}.currentCostume + 1)`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}costumename`, {
        message0: 'costume name',
        args0: [],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(() => { const t = ${TARGET}; return t.getCostumes()[t.currentCostume].name; })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}backdropnumber`, {
        message0: 'backdrop number',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(${STAGE}.currentCostume + 1)`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}backdropname`, {
        message0: 'backdrop name',
        args0: [],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(() => { const s = ${STAGE}; return s.getCostumes()[s.currentCostume].name; })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}size`, {
        message0: 'size',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Math.round(${TARGET}.size)`;
        return [`${code}`, 0];
    })
}

export default register;