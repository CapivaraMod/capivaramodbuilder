import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';

const categoryPrefix = 'motion_';
const categoryColor = '#4c97ff';

const TARGET = `(Scratch.vm.runtime.getEditingTarget() || Scratch.vm.runtime.targets.find(t => !t.isStage))`;

const MOUSE_POINT = `[Scratch.vm.runtime.ioDevices.mouse.getScratchX(), Scratch.vm.runtime.ioDevices.mouse.getScratchY()]`;

const RANDOM_POINT = `[Math.round(Scratch.vm.runtime.stageWidth * (Math.random() - 0.5)), Math.round(Scratch.vm.runtime.stageHeight * (Math.random() - 0.5))]`;

function pointFor(choice) {
    return choice === 'mouse' ? MOUSE_POINT : RANDOM_POINT;
}

function numberField(name, value) {
    return {
        "type": "field_number",
        "name": name,
        "check": "Number",
        "value": value,
        "acceptsBlocks": true
    };
}

function targetDropdown(options) {
    return {
        "type": "field_dropdown",
        "name": "TARGET",
        "options": options
    };
}

function register() {
    registerBlock(`${categoryPrefix}move`, {
        message0: 'move %1 steps',
        args0: [numberField('STEPS', 10)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const STEPS = javascriptGenerator.valueToCode(block, 'STEPS');
        const code = `(() => { const t = ${TARGET}; const r = (90 - t.direction) * Math.PI / 180; t.setXY(t.x + ${STEPS} * Math.cos(r), t.y + ${STEPS} * Math.sin(r)); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}turnright`, {
        message0: 'turn right %1 degrees',
        args0: [numberField('DEGREES', 15)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const DEGREES = javascriptGenerator.valueToCode(block, 'DEGREES');
        const code = `(() => { const t = ${TARGET}; t.setDirection(t.direction + ${DEGREES}); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}turnleft`, {
        message0: 'turn left %1 degrees',
        args0: [numberField('DEGREES', 15)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const DEGREES = javascriptGenerator.valueToCode(block, 'DEGREES');
        const code = `(() => { const t = ${TARGET}; t.setDirection(t.direction - ${DEGREES}); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}goto`, {
        message0: 'go to x: %1 y: %2',
        args0: [numberField('X', 0), numberField('Y', 0)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X');
        const Y = javascriptGenerator.valueToCode(block, 'Y');
        const code = `${TARGET}.setXY(${X}, ${Y});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}gototarget`, {
        message0: 'go to %1',
        args0: [
            targetDropdown([
                ["random position", "random"],
                ["mouse pointer", "mouse"]
            ])
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TARGET_CHOICE = block.getFieldValue('TARGET');
        const code = `(() => { const p = ${pointFor(TARGET_CHOICE)}; ${TARGET}.setXY(p[0], p[1]); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}glide`, {
        message0: 'glide %1 secs to x: %2 y: %3',
        args0: [numberField('SECS', 1), numberField('X', 0), numberField('Y', 0)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SECS = javascriptGenerator.valueToCode(block, 'SECS');
        const X = javascriptGenerator.valueToCode(block, 'X');
        const Y = javascriptGenerator.valueToCode(block, 'Y');
        const code = `await new Promise(done => { const t = ${TARGET}; const sx = t.x; const sy = t.y; const ex = ${X}; const ey = ${Y}; const dur = ${SECS} * 1000; const start = performance.now(); const step = () => { const f = dur > 0 ? Math.min((performance.now() - start) / dur, 1) : 1; t.setXY(sx + (ex - sx) * f, sy + (ey - sy) * f); if (f < 1) { requestAnimationFrame(step); } else { done(); } }; step(); });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}glidetarget`, {
        message0: 'glide %1 secs to %2',
        args0: [
            numberField('SECS', 1),
            targetDropdown([
                ["random position", "random"],
                ["mouse pointer", "mouse"]
            ])
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SECS = javascriptGenerator.valueToCode(block, 'SECS');
        const TARGET_CHOICE = block.getFieldValue('TARGET');
        const code = `await new Promise(done => { const t = ${TARGET}; const p = ${pointFor(TARGET_CHOICE)}; const sx = t.x; const sy = t.y; const dur = ${SECS} * 1000; const start = performance.now(); const step = () => { const f = dur > 0 ? Math.min((performance.now() - start) / dur, 1) : 1; t.setXY(sx + (p[0] - sx) * f, sy + (p[1] - sy) * f); if (f < 1) { requestAnimationFrame(step); } else { done(); } }; step(); });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}pointdirection`, {
        message0: 'point in direction %1',
        args0: [numberField('DIRECTION', 90)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const DIRECTION = javascriptGenerator.valueToCode(block, 'DIRECTION');
        const code = `${TARGET}.setDirection(${DIRECTION});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}pointtowards`, {
        message0: 'point towards %1',
        args0: [
            targetDropdown([
                ["mouse pointer", "mouse"],
                ["random direction", "random"]
            ])
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TARGET_CHOICE = block.getFieldValue('TARGET');
        let code;
        if (TARGET_CHOICE === 'mouse') {
            code = `(() => { const t = ${TARGET}; const p = ${MOUSE_POINT}; t.setDirection(90 - Math.atan2(p[1] - t.y, p[0] - t.x) * 180 / Math.PI); })();`;
        } else {
            code = `${TARGET}.setDirection(Math.round(Math.random() * 360) - 180);`;
        }
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}changex`, {
        message0: 'change x by %1',
        args0: [numberField('DX', 10)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const DX = javascriptGenerator.valueToCode(block, 'DX');
        const code = `(() => { const t = ${TARGET}; t.setXY(t.x + ${DX}, t.y); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}setx`, {
        message0: 'set x to %1',
        args0: [numberField('X', 0)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X');
        const code = `(() => { const t = ${TARGET}; t.setXY(${X}, t.y); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}changey`, {
        message0: 'change y by %1',
        args0: [numberField('DY', 10)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const DY = javascriptGenerator.valueToCode(block, 'DY');
        const code = `(() => { const t = ${TARGET}; t.setXY(t.x, t.y + ${DY}); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}sety`, {
        message0: 'set y to %1',
        args0: [numberField('Y', 0)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const Y = javascriptGenerator.valueToCode(block, 'Y');
        const code = `(() => { const t = ${TARGET}; t.setXY(t.x, ${Y}); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}bounce`, {
        message0: 'if on edge, bounce',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(() => { const t = ${TARGET}; const rt = Scratch.vm.runtime; const b = t.getBounds(); if (!b) return; const dl = Math.max(0, rt.stageWidth / 2 + b.left); const dt = Math.max(0, rt.stageHeight / 2 - b.top); const dr = Math.max(0, rt.stageWidth / 2 - b.right); const db = Math.max(0, rt.stageHeight / 2 + b.bottom); const m = Math.min(dl, dt, dr, db); if (m > 0) return; const r = (90 - t.direction) * Math.PI / 180; let dx = Math.cos(r); let dy = -Math.sin(r); if (m === dl) { dx = Math.max(0.2, Math.abs(dx)); } else if (m === dt) { dy = Math.max(0.2, Math.abs(dy)); } else if (m === dr) { dx = -Math.max(0.2, Math.abs(dx)); } else { dy = -Math.max(0.2, Math.abs(dy)); } t.setDirection(Math.atan2(dy, dx) * 180 / Math.PI + 90); t.keepInFence(t.x, t.y); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}rotationstyle`, {
        message0: 'set rotation style %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "STYLE",
                "options": [
                    ["left-right", "left-right"],
                    ["don't rotate", "don't rotate"],
                    ["all around", "all around"]
                ]
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const STYLE = block.getFieldValue('STYLE');
        const code = `${TARGET}.setRotationStyle(${JSON.stringify(STYLE)});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}xposition`, {
        message0: 'x position',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Number(${TARGET}.x.toFixed(2))`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}yposition`, {
        message0: 'y position',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Number(${TARGET}.y.toFixed(2))`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}direction`, {
        message0: 'direction',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `${TARGET}.direction`;
        return [`${code}`, 0];
    })
}

export default register;