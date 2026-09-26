import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';
import Blockly from 'blockly/core';

const categoryPrefix = 'inputs_';
const categoryColor = '#69d';

const TARGET = `(Scratch.vm.runtime.getEditingTarget() || Scratch.vm.runtime.targets.find(t => !t.isStage))`;

let keys = [
    "any",
    "space",
    "shift",
    "up arrow",
    "down arrow",
    "left arrow",
    "right arrow",
    ["plus", "+"],
    ["minus", "-"],
    ["equals", "="],
    ["underscore", "_"],
    ["colon", ":"],
    ["semicolon", ";"],
    ["period", "."],
    ["comma", ","],
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
].map(v => typeof v == "string" ? [v, v] : v);

function register() {
    registerBlock(`${categoryPrefix}keypress`, {
        message0: 'is key %1 pressed?',
        args0: [
            {
                "type": "field_dropdown",
                "name": "KEY",
                "options": keys,
                "check": "String",
                "acceptsBlocks": true
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const KEY = javascriptGenerator.valueToCode(block, 'KEY');
        const code = `Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(${KEY})`;
        return [`${code}`, 0];
    })
    
    registerBlock(`${categoryPrefix}keyspressed`, {
        message0: 'keys pressed',
        args0: [],
        output: "List",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.keyboard.getAllKeysPressed()`;
        return [`${code}`, 0];
    })
    
    registerBlock(`${categoryPrefix}mousex`, {
        message0: 'mouse x',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.mouse.getScratchX()`;
        return [`${code}`, 0];
    })
    registerBlock(`${categoryPrefix}mousey`, {
        message0: 'mouse y',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.mouse.getScratchY()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}moused`, {
        message0: 'mouse down',
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.mouse.getIsDown()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}touching`, {
        message0: 'touching %1 ?',
        args0: [
            {
                "type": "field_dropdown",
                "name": "OBJECT",
                "options": [
                    ["mouse pointer", "_mouse_"],
                    ["edge", "_edge_"]
                ]
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const OBJECT = block.getFieldValue('OBJECT');
        const code = `${TARGET}.isTouchingObject("${OBJECT}")`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}touchingsprite`, {
        message0: 'touching sprite %1 ?',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "check": "String",
                "text": "Sprite1",
                "acceptsBlocks": true
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `${TARGET}.isTouchingObject(${NAME})`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}touchingcolor`, {
        message0: 'touching color %1 ?',
        args0: [
            {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#ff0000",
                "check": "Colour",
                "acceptsBlocks": true
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const COLOR = javascriptGenerator.valueToCode(block, 'COLOR');
        const code = `${TARGET}.isTouchingColor(Scratch.Cast.toRgbColorList(${COLOR}))`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}distancemouse`, {
        message0: 'distance to mouse pointer',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(() => { const t = ${TARGET}; const m = Scratch.vm.runtime.ioDevices.mouse; return Math.sqrt(Math.pow(t.x - m.getScratchX(), 2) + Math.pow(t.y - m.getScratchY(), 2)); })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}distancesprite`, {
        message0: 'distance to sprite %1',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "check": "String",
                "text": "Sprite1",
                "acceptsBlocks": true
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `(() => { const t = ${TARGET}; const o = Scratch.vm.runtime.getSpriteTargetByName(${NAME}); if (!o) return 10000; return Math.sqrt(Math.pow(t.x - o.x, 2) + Math.pow(t.y - o.y, 2)); })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}ask`, {
        message0: 'ask %1 and wait',
        args0: [
            {
                "type": "field_input",
                "name": "QUESTION",
                "check": "String",
                "text": "What's your name?",
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const QUESTION = javascriptGenerator.valueToCode(block, 'QUESTION');
        const code = `await Scratch.vm.runtime.ext_scratch3_sensing.askAndWait({ QUESTION: ${QUESTION} }, { target: ${TARGET} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}answer`, {
        message0: 'answer',
        args0: [],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ext_scratch3_sensing.getAnswer()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}timer`, {
        message0: 'timer',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.clock.projectTimer()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}resettimer`, {
        message0: 'reset timer',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.clock.resetProjectTimer();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}current`, {
        message0: 'current %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "UNIT",
                "options": [
                    ["year", "new Date().getFullYear()"],
                    ["month", "(new Date().getMonth() + 1)"],
                    ["date", "new Date().getDate()"],
                    ["day of week", "(new Date().getDay() + 1)"],
                    ["hour", "new Date().getHours()"],
                    ["minute", "new Date().getMinutes()"],
                    ["second", "new Date().getSeconds()"]
                ]
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = block.getFieldValue('UNIT');
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}dayssince2000`, {
        message0: 'days since 2000',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(() => { const start = new Date(2000, 0, 1); const today = new Date(); const dst = today.getTimezoneOffset() - start.getTimezoneOffset(); let ms = today.valueOf() - start.valueOf(); ms += (today.getTimezoneOffset() - dst) * 60 * 1000; return ms / 86400000; })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}username`, {
        message0: 'username',
        args0: [],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.userData.getUsername()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}loudness`, {
        message0: 'loudness',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(Scratch.vm.runtime.audioEngine && Scratch.vm.runtime.audioEngine.getLoudness ? Scratch.vm.runtime.audioEngine.getLoudness() : -1)`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}setdrag`, {
        message0: 'set drag mode %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    ["draggable", "true"],
                    ["not draggable", "false"]
                ]
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const MODE = block.getFieldValue('MODE');
        const code = `${TARGET}.setDraggable(${MODE});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}draggable`, {
        message0: 'draggable?',
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Boolean(${TARGET}.draggable)`;
        return [`${code}`, 0];
    })
}

export default register;