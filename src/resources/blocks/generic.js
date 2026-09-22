import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';
import Blockly from 'blockly/core';

const categoryPrefix = 'generic_';
const categoryColor = '#fff';

function register() {
    registerBlock(`${categoryPrefix}number`, {
        message0: '%1',
        args0: [
            {
                "type": "field_number",
                "name": "NUMBER",
                "value": 0
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NUMBER = block.getFieldValue('NUMBER');
        const code = `Number(${NUMBER})`;
        return [code, 0];
    })
    
    registerBlock(`${categoryPrefix}text`, {
        message0: '%1',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": ""
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = block.getFieldValue('TEXT');
        const code = `String(${JSON.stringify(TEXT)})`;
        return [code, 0];
    })
    
    registerBlock(`${categoryPrefix}any`, {
        message0: '%1',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": ""
            }
        ],
        output: ["String", "Number"],
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = block.getFieldValue('TEXT');
        const code = `String(${JSON.stringify(TEXT)})`;
        return [code, 0];
    })
    
    registerBlock(`${categoryPrefix}boolean`, {
        message0: '%1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "STATE",
                "options": [
                    ["true", "true"], 
                    ["false", "false"], 
                    ["random", "Boolean(Math.round(Math.random()))"]
                ]
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = block.getFieldValue('STATE');
        return [code, 0];
    })
}

export default register;