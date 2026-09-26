import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';

const categoryPrefix = 'colors_';
const categoryColor = '#ff8c69';

// Shared helper library, lazily created on window so every generated block
// can reuse the same (tested) conversion math instead of duplicating it.
const HELPERS = `(window.__capivaraColor || (window.__capivaraColor = {
    clamp: (v, min, max) => Math.max(min, Math.min(max, v)),
    toHex: function(r, g, b) {
        const c = (n) => this.clamp(Math.round(Number(n) || 0), 0, 255).toString(16).padStart(2, '0');
        return '#' + c(r) + c(g) + c(b);
    },
    parse: function(color) {
        let hex = String(color == null ? '' : color).trim();
        if (hex[0] !== '#') hex = '#' + hex;
        if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        const match = /^#([0-9a-fA-F]{6})$/.exec(hex);
        if (!match) return { r: 0, g: 0, b: 0 };
        const num = parseInt(match[1], 16);
        return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    },
    fromHsv: function(h, s, v) {
        h = ((Number(h) || 0) % 360 + 360) % 360;
        s = this.clamp(Number(s) || 0, 0, 100) / 100;
        v = this.clamp(Number(v) || 0, 0, 100) / 100;
        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;
        let r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        return this.toHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
    },
    mix: function(colorA, colorB, percent) {
        const a = this.parse(colorA);
        const b = this.parse(colorB);
        const p = this.clamp(Number(percent) || 0, 0, 100) / 100;
        return this.toHex(
            a.r + (b.r - a.r) * p,
            a.g + (b.g - a.g) * p,
            a.b + (b.b - a.b) * p
        );
    },
    shade: function(color, percent) {
        const c = this.parse(color);
        const p = this.clamp(Number(percent) || 0, -100, 100) / 100;
        const target = p < 0 ? 0 : 255;
        const amt = Math.abs(p);
        return this.toHex(
            c.r + (target - c.r) * amt,
            c.g + (target - c.g) * amt,
            c.b + (target - c.b) * amt
        );
    }
}))`;

function colourField(name, colour = '#ff0000') {
    return {
        "type": "field_colour",
        "name": name,
        "colour": colour,
        "check": "Colour",
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

function textField(name, text) {
    return {
        "type": "field_input",
        "name": name,
        "check": "String",
        "text": text,
        "acceptsBlocks": true
    };
}

function register() {
    registerBlock(`${categoryPrefix}fromrgb`, {
        message0: 'color from red %1 green %2 blue %3',
        args0: [numberField('R', 255), numberField('G', 0), numberField('B', 0)],
        output: "Colour",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const R = javascriptGenerator.valueToCode(block, 'R');
        const G = javascriptGenerator.valueToCode(block, 'G');
        const B = javascriptGenerator.valueToCode(block, 'B');
        const code = `${HELPERS}.toHex(${R}, ${G}, ${B})`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}fromhsv`, {
        message0: 'color from hue %1 saturation %2 value %3',
        args0: [numberField('H', 0), numberField('S', 100), numberField('V', 100)],
        output: "Colour",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const H = javascriptGenerator.valueToCode(block, 'H');
        const S = javascriptGenerator.valueToCode(block, 'S');
        const V = javascriptGenerator.valueToCode(block, 'V');
        const code = `${HELPERS}.fromHsv(${H}, ${S}, ${V})`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}fromhex`, {
        message0: 'color from hex %1',
        args0: [textField('HEX', '#ff0000')],
        output: "Colour",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const HEX = javascriptGenerator.valueToCode(block, 'HEX');
        const code = `(() => { const c = ${HELPERS}.parse(${HEX}); return ${HELPERS}.toHex(c.r, c.g, c.b); })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}tohex`, {
        message0: 'hex of color %1',
        args0: [colourField('COLOR')],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const COLOR = javascriptGenerator.valueToCode(block, 'COLOR');
        const code = `String(${COLOR})`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}torgblist`, {
        message0: 'RGB list of color %1',
        args0: [colourField('COLOR')],
        output: "List",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const COLOR = javascriptGenerator.valueToCode(block, 'COLOR');
        const code = `(() => { const c = ${HELPERS}.parse(${COLOR}); return [c.r, c.g, c.b]; })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}component`, {
        message0: '%1 value of color %2',
        args0: [
            {
                "type": "field_dropdown",
                "name": "CHANNEL",
                "options": [
                    ["red", "r"],
                    ["green", "g"],
                    ["blue", "b"]
                ]
            },
            colourField('COLOR')
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CHANNEL = block.getFieldValue('CHANNEL');
        const COLOR = javascriptGenerator.valueToCode(block, 'COLOR');
        const code = `${HELPERS}.parse(${COLOR}).${CHANNEL}`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}mix`, {
        message0: 'mix color %1 and %2 by %3 %%',
        args0: [colourField('COLOR1', '#ff0000'), colourField('COLOR2', '#0000ff'), numberField('PERCENT', 50)],
        output: "Colour",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const COLOR1 = javascriptGenerator.valueToCode(block, 'COLOR1');
        const COLOR2 = javascriptGenerator.valueToCode(block, 'COLOR2');
        const PERCENT = javascriptGenerator.valueToCode(block, 'PERCENT');
        const code = `${HELPERS}.mix(${COLOR1}, ${COLOR2}, ${PERCENT})`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}lighten`, {
        message0: 'lighten color %1 by %2 %%',
        args0: [colourField('COLOR'), numberField('PERCENT', 20)],
        output: "Colour",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const COLOR = javascriptGenerator.valueToCode(block, 'COLOR');
        const PERCENT = javascriptGenerator.valueToCode(block, 'PERCENT');
        const code = `${HELPERS}.shade(${COLOR}, ${PERCENT})`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}darken`, {
        message0: 'darken color %1 by %2 %%',
        args0: [colourField('COLOR'), numberField('PERCENT', 20)],
        output: "Colour",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const COLOR = javascriptGenerator.valueToCode(block, 'COLOR');
        const PERCENT = javascriptGenerator.valueToCode(block, 'PERCENT');
        const code = `${HELPERS}.shade(${COLOR}, -(${PERCENT}))`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}invert`, {
        message0: 'invert color %1',
        args0: [colourField('COLOR')],
        output: "Colour",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const COLOR = javascriptGenerator.valueToCode(block, 'COLOR');
        const code = `(() => { const c = ${HELPERS}.parse(${COLOR}); return ${HELPERS}.toHex(255 - c.r, 255 - c.g, 255 - c.b); })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}random`, {
        message0: 'random color',
        args0: [],
        output: "Colour",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `${HELPERS}.toHex(Math.random() * 256, Math.random() * 256, Math.random() * 256)`;
        return [`${code}`, 0];
    })
}

export default register;