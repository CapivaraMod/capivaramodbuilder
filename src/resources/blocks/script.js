import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';
import util from '../util';

const categoryPrefix = 'script_';
const categoryColor = '#9d5';

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
    registerBlock(`${categoryPrefix}evalb`, {
        message0: 'eval %1',
        args0: [
            {
                "type": "field_input",
                "name": "INPUT",
                "check": "String",
                "text": "alert(\"hi\")",
                "acceptsBlocks": true
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `eval(${INPUT})`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}evalv`, {
        message0: 'eval %1',
        args0: [
            {
                "type": "field_input",
                "name": "INPUT",
                "check": "String",
                "text": "Math.random()",
                "acceptsBlocks": true
            },
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `eval(${INPUT})`;
        return [code, 0];
    })

    registerBlock(`${categoryPrefix}fetch`, {
        message0: 'fetch %1',
        args0: [textField('URL', 'https://example.com')],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const URL = javascriptGenerator.valueToCode(block, 'URL');
        const code = `(await (await fetch(${URL})).text())`;
        return [code, 0];
    })

    registerBlock(`${categoryPrefix}fetchjson`, {
        message0: 'fetch json %1',
        args0: [textField('URL', 'https://example.com/data.json')],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const URL = javascriptGenerator.valueToCode(block, 'URL');
        const code = `(await (await fetch(${URL})).json())`;
        return [code, 0];
    })

    registerBlock(`${categoryPrefix}fetchadvanced`, {
        message0: 'fetch %1 method %2 headers %3 body %4',
        args0: [
            textField('URL', 'https://example.com'),
            {
                "type": "field_dropdown",
                "name": "METHOD",
                "options": [
                    ["GET", "GET"],
                    ["POST", "POST"],
                    ["PUT", "PUT"],
                    ["PATCH", "PATCH"],
                    ["DELETE", "DELETE"]
                ]
            },
            textField('HEADERS', '{}'),
            textField('BODY', '')
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const URL = javascriptGenerator.valueToCode(block, 'URL');
        const METHOD = block.getFieldValue('METHOD');
        const HEADERS = javascriptGenerator.valueToCode(block, 'HEADERS');
        const BODY = javascriptGenerator.valueToCode(block, 'BODY');
        const code = `(await (await fetch(${URL}, { method: "${METHOD}", headers: JSON.parse(${HEADERS} || "{}"), body: ${BODY} ? ${BODY} : undefined })).text())`;
        return [code, 0];
    })

    registerBlock(`${categoryPrefix}jsonparse`, {
        message0: 'parse json %1',
        args0: [textField('TEXT', '{"a":1}')],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT');
        const code = `JSON.parse(${TEXT})`;
        return [code, 0];
    })

    registerBlock(`${categoryPrefix}jsonstringify`, {
        message0: 'to json %1',
        args0: [
            {
                "type": "field_input",
                "name": "INPUT",
                "check": null,
                "text": "",
                "acceptsBlocks": true
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `JSON.stringify(${INPUT})`;
        return [code, 0];
    })

    registerBlock(`${categoryPrefix}consolelog`, {
        message0: 'console log %1',
        args0: [
            {
                "type": "field_input",
                "name": "INPUT",
                "check": null,
                "text": "hello",
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `console.log(${INPUT});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}consoleerror`, {
        message0: 'console error %1',
        args0: [
            {
                "type": "field_input",
                "name": "INPUT",
                "check": null,
                "text": "something went wrong",
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `console.error(${INPUT});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}trycatch`, {
        message0: 'try %1 %2 catch %3 %4',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "TRY"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "CATCH"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TRY = javascriptGenerator.statementToCode(block, 'TRY');
        const CATCH = javascriptGenerator.statementToCode(block, 'CATCH');
        const varName = "err_" + util.randomHex(24);
        const code = `try { ${TRY} } catch (${varName}) { CapivaraModBuilder.Utils.lastError = ${varName}; ${CATCH} }`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}lasterror`, {
        message0: 'last error message',
        args0: [],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(CapivaraModBuilder.Utils.lastError ? CapivaraModBuilder.Utils.lastError.message : "")`;
        return [code, 0];
    })

    registerBlock(`${categoryPrefix}typeof`, {
        message0: 'typeof %1',
        args0: [
            {
                "type": "field_input",
                "name": "INPUT",
                "check": null,
                "text": "",
                "acceptsBlocks": true
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `typeof (${INPUT})`;
        return [code, 0];
    })

    registerBlock(`${categoryPrefix}globalget`, {
        message0: 'get global %1',
        args0: [textField('NAME', 'myGlobal')],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `window[${NAME}]`;
        return [code, 0];
    })

    registerBlock(`${categoryPrefix}globalset`, {
        message0: 'set global %1 to %2',
        args0: [
            textField('NAME', 'myGlobal'),
            {
                "type": "field_input",
                "name": "VALUE",
                "check": null,
                "text": "",
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE');
        const code = `window[${NAME}] = ${VALUE};`;
        return `${code}\n`;
    })
}

export default register;