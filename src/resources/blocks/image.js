import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';

const categoryPrefix = 'image_';
const categoryColor = '#d65';

const STORE = `(window.__capivaraImages || (window.__capivaraImages = {}))`;
const TARGET = `(Scratch.vm.runtime.getEditingTarget() || Scratch.vm.runtime.targets.find(t => !t.isStage))`;

function textField(name, text) {
    return {
        "type": "field_input",
        "name": name,
        "check": "String",
        "text": text,
        "acceptsBlocks": true
    };
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

function register() {
    registerBlock(`${categoryPrefix}loadurl`, {
        message0: 'load image %1 from url %2',
        args0: [textField('NAME', 'myImage'), textField('URL', 'https://example.com/image.png')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const URL = javascriptGenerator.valueToCode(block, 'URL');
        const code = `await new Promise((resolve, reject) => { const store = ${STORE}; const img = new Image(); img.crossOrigin = "anonymous"; img.onload = () => { const canvas = document.createElement("canvas"); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; const ctx = canvas.getContext("2d"); ctx.drawImage(img, 0, 0); store[${NAME}] = canvas; resolve(); }; img.onerror = reject; img.src = ${URL}; });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}createblank`, {
        message0: 'create blank image %1 width %2 height %3',
        args0: [textField('NAME', 'myImage'), numberField('WIDTH', 100), numberField('HEIGHT', 100)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const WIDTH = javascriptGenerator.valueToCode(block, 'WIDTH');
        const HEIGHT = javascriptGenerator.valueToCode(block, 'HEIGHT');
        const code = `(() => { const store = ${STORE}; const canvas = document.createElement("canvas"); canvas.width = ${WIDTH}; canvas.height = ${HEIGHT}; store[${NAME}] = canvas; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}copy`, {
        message0: 'copy image %1 to %2',
        args0: [textField('SOURCE', 'myImage'), textField('NAME', 'myImageCopy')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SOURCE = javascriptGenerator.valueToCode(block, 'SOURCE');
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `(() => { const store = ${STORE}; const src = store[${SOURCE}]; if (!src) return; const canvas = document.createElement("canvas"); canvas.width = src.width; canvas.height = src.height; canvas.getContext("2d").drawImage(src, 0, 0); store[${NAME}] = canvas; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}deleteimage`, {
        message0: 'delete image %1',
        args0: [textField('NAME', 'myImage')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `delete ${STORE}[${NAME}];`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}exists`, {
        message0: 'image %1 exists?',
        args0: [textField('NAME', 'myImage')],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `Boolean(${STORE}[${NAME}])`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}width`, {
        message0: 'width of image %1',
        args0: [textField('NAME', 'myImage')],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `(${STORE}[${NAME}] ? ${STORE}[${NAME}].width : 0)`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}height`, {
        message0: 'height of image %1',
        args0: [textField('NAME', 'myImage')],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `(${STORE}[${NAME}] ? ${STORE}[${NAME}].height : 0)`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}resize`, {
        message0: 'resize image %1 to width %2 height %3',
        args0: [textField('NAME', 'myImage'), numberField('WIDTH', 100), numberField('HEIGHT', 100)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const WIDTH = javascriptGenerator.valueToCode(block, 'WIDTH');
        const HEIGHT = javascriptGenerator.valueToCode(block, 'HEIGHT');
        const code = `(() => { const store = ${STORE}; const src = store[${NAME}]; if (!src) return; const canvas = document.createElement("canvas"); canvas.width = ${WIDTH}; canvas.height = ${HEIGHT}; canvas.getContext("2d").drawImage(src, 0, 0, ${WIDTH}, ${HEIGHT}); store[${NAME}] = canvas; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}crop`, {
        message0: 'crop image %1 x %2 y %3 width %4 height %5',
        args0: [textField('NAME', 'myImage'), numberField('X', 0), numberField('Y', 0), numberField('WIDTH', 50), numberField('HEIGHT', 50)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const X = javascriptGenerator.valueToCode(block, 'X');
        const Y = javascriptGenerator.valueToCode(block, 'Y');
        const WIDTH = javascriptGenerator.valueToCode(block, 'WIDTH');
        const HEIGHT = javascriptGenerator.valueToCode(block, 'HEIGHT');
        const code = `(() => { const store = ${STORE}; const src = store[${NAME}]; if (!src) return; const canvas = document.createElement("canvas"); canvas.width = ${WIDTH}; canvas.height = ${HEIGHT}; canvas.getContext("2d").drawImage(src, ${X}, ${Y}, ${WIDTH}, ${HEIGHT}, 0, 0, ${WIDTH}, ${HEIGHT}); store[${NAME}] = canvas; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}rotate`, {
        message0: 'rotate image %1 by %2 degrees',
        args0: [textField('NAME', 'myImage'), numberField('DEGREES', 90)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const DEGREES = javascriptGenerator.valueToCode(block, 'DEGREES');
        const code = `(() => { const store = ${STORE}; const src = store[${NAME}]; if (!src) return; const rad = ${DEGREES} * Math.PI / 180; const w = src.width; const h = src.height; const newW = Math.ceil(Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad))); const newH = Math.ceil(Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad))); const canvas = document.createElement("canvas"); canvas.width = newW; canvas.height = newH; const ctx = canvas.getContext("2d"); ctx.translate(newW / 2, newH / 2); ctx.rotate(rad); ctx.drawImage(src, -w / 2, -h / 2); store[${NAME}] = canvas; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}flip`, {
        message0: 'flip image %1 %2',
        args0: [
            textField('NAME', 'myImage'),
            {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    ["horizontally", "horizontal"],
                    ["vertically", "vertical"]
                ]
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const DIRECTION = block.getFieldValue('DIRECTION');
        const scaleX = DIRECTION === 'horizontal' ? -1 : 1;
        const scaleY = DIRECTION === 'vertical' ? -1 : 1;
        const translateX = DIRECTION === 'horizontal' ? 'canvas.width' : '0';
        const translateY = DIRECTION === 'vertical' ? 'canvas.height' : '0';
        const code = `(() => { const store = ${STORE}; const src = store[${NAME}]; if (!src) return; const canvas = document.createElement("canvas"); canvas.width = src.width; canvas.height = src.height; const ctx = canvas.getContext("2d"); ctx.translate(${translateX}, ${translateY}); ctx.scale(${scaleX}, ${scaleY}); ctx.drawImage(src, 0, 0); store[${NAME}] = canvas; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}grayscale`, {
        message0: 'convert image %1 to grayscale',
        args0: [textField('NAME', 'myImage')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `(() => { const store = ${STORE}; const canvas = store[${NAME}]; if (!canvas) return; const ctx = canvas.getContext("2d"); const data = ctx.getImageData(0, 0, canvas.width, canvas.height); const px = data.data; for (let i = 0; i < px.length; i += 4) { const v = px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114; px[i] = v; px[i + 1] = v; px[i + 2] = v; } ctx.putImageData(data, 0, 0); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}invert`, {
        message0: 'invert colors of image %1',
        args0: [textField('NAME', 'myImage')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `(() => { const store = ${STORE}; const canvas = store[${NAME}]; if (!canvas) return; const ctx = canvas.getContext("2d"); const data = ctx.getImageData(0, 0, canvas.width, canvas.height); const px = data.data; for (let i = 0; i < px.length; i += 4) { px[i] = 255 - px[i]; px[i + 1] = 255 - px[i + 1]; px[i + 2] = 255 - px[i + 2]; } ctx.putImageData(data, 0, 0); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}brightness`, {
        message0: 'change brightness of image %1 by %2',
        args0: [textField('NAME', 'myImage'), numberField('AMOUNT', 20)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const AMOUNT = javascriptGenerator.valueToCode(block, 'AMOUNT');
        const code = `(() => { const store = ${STORE}; const canvas = store[${NAME}]; if (!canvas) return; const ctx = canvas.getContext("2d"); const data = ctx.getImageData(0, 0, canvas.width, canvas.height); const px = data.data; for (let i = 0; i < px.length; i += 4) { px[i] = Math.max(0, Math.min(255, px[i] + ${AMOUNT})); px[i + 1] = Math.max(0, Math.min(255, px[i + 1] + ${AMOUNT})); px[i + 2] = Math.max(0, Math.min(255, px[i + 2] + ${AMOUNT})); } ctx.putImageData(data, 0, 0); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}contrast`, {
        message0: 'change contrast of image %1 by %2',
        args0: [textField('NAME', 'myImage'), numberField('AMOUNT', 20)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const AMOUNT = javascriptGenerator.valueToCode(block, 'AMOUNT');
        const code = `(() => { const store = ${STORE}; const canvas = store[${NAME}]; if (!canvas) return; const ctx = canvas.getContext("2d"); const data = ctx.getImageData(0, 0, canvas.width, canvas.height); const px = data.data; const factor = (259 * (${AMOUNT} + 255)) / (255 * (259 - ${AMOUNT})); for (let i = 0; i < px.length; i += 4) { px[i] = Math.max(0, Math.min(255, factor * (px[i] - 128) + 128)); px[i + 1] = Math.max(0, Math.min(255, factor * (px[i + 1] - 128) + 128)); px[i + 2] = Math.max(0, Math.min(255, factor * (px[i + 2] - 128) + 128)); } ctx.putImageData(data, 0, 0); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}setopacity`, {
        message0: 'set opacity of image %1 to %2 %%',
        args0: [textField('NAME', 'myImage'), numberField('OPACITY', 50)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const OPACITY = javascriptGenerator.valueToCode(block, 'OPACITY');
        const code = `(() => { const store = ${STORE}; const canvas = store[${NAME}]; if (!canvas) return; const ctx = canvas.getContext("2d"); const data = ctx.getImageData(0, 0, canvas.width, canvas.height); const px = data.data; const factor = Math.max(0, Math.min(100, ${OPACITY})) / 100; for (let i = 3; i < px.length; i += 4) { px[i] = px[i] * factor; } ctx.putImageData(data, 0, 0); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}getpixel`, {
        message0: 'get pixel color of image %1 x %2 y %3',
        args0: [textField('NAME', 'myImage'), numberField('X', 0), numberField('Y', 0)],
        output: "List",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const X = javascriptGenerator.valueToCode(block, 'X');
        const Y = javascriptGenerator.valueToCode(block, 'Y');
        const code = `(() => { const canvas = ${STORE}[${NAME}]; if (!canvas) return [0, 0, 0, 0]; const px = canvas.getContext("2d").getImageData(${X}, ${Y}, 1, 1).data; return [px[0], px[1], px[2], px[3]]; })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}setpixel`, {
        message0: 'set pixel color of image %1 x %2 y %3 to r %4 g %5 b %6 a %7',
        args0: [
            textField('NAME', 'myImage'),
            numberField('X', 0),
            numberField('Y', 0),
            numberField('R', 255),
            numberField('G', 0),
            numberField('B', 0),
            numberField('A', 255)
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const X = javascriptGenerator.valueToCode(block, 'X');
        const Y = javascriptGenerator.valueToCode(block, 'Y');
        const R = javascriptGenerator.valueToCode(block, 'R');
        const G = javascriptGenerator.valueToCode(block, 'G');
        const B = javascriptGenerator.valueToCode(block, 'B');
        const A = javascriptGenerator.valueToCode(block, 'A');
        const code = `(() => { const canvas = ${STORE}[${NAME}]; if (!canvas) return; const ctx = canvas.getContext("2d"); const data = ctx.createImageData(1, 1); data.data[0] = ${R}; data.data[1] = ${G}; data.data[2] = ${B}; data.data[3] = ${A}; ctx.putImageData(data, ${X}, ${Y}); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}drawimage`, {
        message0: 'draw image %1 onto %2 at x %3 y %4',
        args0: [textField('SOURCE', 'stamp'), textField('TARGET', 'canvas'), numberField('X', 0), numberField('Y', 0)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SOURCE = javascriptGenerator.valueToCode(block, 'SOURCE');
        const TARGET_NAME = javascriptGenerator.valueToCode(block, 'TARGET');
        const X = javascriptGenerator.valueToCode(block, 'X');
        const Y = javascriptGenerator.valueToCode(block, 'Y');
        const code = `(() => { const store = ${STORE}; const src = store[${SOURCE}]; const dst = store[${TARGET_NAME}]; if (!src || !dst) return; dst.getContext("2d").drawImage(src, ${X}, ${Y}); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}fillrect`, {
        message0: 'fill rectangle on image %1 x %2 y %3 width %4 height %5 color %6',
        args0: [
            textField('NAME', 'myImage'),
            numberField('X', 0),
            numberField('Y', 0),
            numberField('WIDTH', 20),
            numberField('HEIGHT', 20),
            {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#ff0000"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const X = javascriptGenerator.valueToCode(block, 'X');
        const Y = javascriptGenerator.valueToCode(block, 'Y');
        const WIDTH = javascriptGenerator.valueToCode(block, 'WIDTH');
        const HEIGHT = javascriptGenerator.valueToCode(block, 'HEIGHT');
        const COLOR = block.getFieldValue('COLOR');
        const code = `(() => { const canvas = ${STORE}[${NAME}]; if (!canvas) return; const ctx = canvas.getContext("2d"); ctx.fillStyle = ${JSON.stringify(COLOR)}; ctx.fillRect(${X}, ${Y}, ${WIDTH}, ${HEIGHT}); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}clear`, {
        message0: 'clear image %1',
        args0: [textField('NAME', 'myImage')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `(() => { const canvas = ${STORE}[${NAME}]; if (!canvas) return; canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}todataurl`, {
        message0: 'image %1 as data url',
        args0: [textField('NAME', 'myImage')],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `(${STORE}[${NAME}] ? ${STORE}[${NAME}].toDataURL("image/png") : "")`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}setascostume`, {
        message0: 'set image %1 as costume %2',
        args0: [textField('NAME', 'myImage'), textField('COSTUME', 'costume1')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const COSTUME = javascriptGenerator.valueToCode(block, 'COSTUME');
        const code = `await (async () => { const canvas = ${STORE}[${NAME}]; if (!canvas) return; const target = ${TARGET}; const blob = await new Promise(resolve => canvas.toBlob(resolve)); const bitmap = await Scratch.vm.runtime.storage.load(Scratch.vm.runtime.storage.AssetType.ImageBitmap, new Uint8Array(await blob.arrayBuffer()), Scratch.vm.runtime.storage.DataFormat.PNG); Scratch.vm.addCostume(bitmap.assetId + "." + bitmap.dataFormat, { name: ${COSTUME}, md5: bitmap.assetId + "." + bitmap.dataFormat, asset: bitmap }, target.id); })();`;
        return `${code}\n`;
    })
}

export default register;