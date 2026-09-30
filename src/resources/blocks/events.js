import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';
import { TARGET, UTIL } from './target';

const categoryPrefix = 'events_';
const categoryColor = '#fc6';


function register() {
    registerBlock(`${categoryPrefix}loaded`, {
        message0: 'when extension loaded %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `(async () => { ${BLOCKS} })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}thread`, {
        message0: 'new thread %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `(async () => { ${BLOCKS} })();`;
        return `${code}\n`;
    })

    //broadcasts
    registerBlock(`${categoryPrefix}regbroadcast`, {
        message0: 'when %1 broadcasted %2 %3',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 2,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        // antes a funcao era EXECUTADA na hora do registro (o `()` no fim) em vez de guardada
        const code = `CapivaraModBuilder.Broadcasts.register(${NAME}, async (util) => { ${BLOCKS} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}broadcast`, {
        message0: 'broadcast %1',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `CapivaraModBuilder.Broadcasts.execute(${NAME}, ${UTIL});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}broadcastw`, {
        message0: 'broadcast %1 and wait',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `await CapivaraModBuilder.Broadcasts.execute(${NAME}, ${UTIL});`;
        return `${code}\n`;
    })

    //scratch-style hats
    registerBlock(`${categoryPrefix}whenflagclicked`, {
        message0: 'when green flag clicked %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `Scratch.vm.on('PROJECT_START', (async () => { ${BLOCKS} }));`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}whenkeypressed`, {
        message0: 'when %1 key pressed %2 %3',
        args0: [
            {
                "type": "field_input",
                "name": "KEY",
                "text": "space",
                "check": "String",
                "acceptsBlocks": true
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const KEY = javascriptGenerator.valueToCode(block, 'KEY');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `Scratch.vm.runtime.on('KEY_PRESSED', (async (key) => { if (key !== ${KEY}) return; ${BLOCKS} }));`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}whenspriteclicked`, {
        message0: 'when this sprite clicked %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        // 'targetWasClicked' nao existe no VM; o clique chega via startHats('event_whenthisspriteclicked', null, target).
        // `util.target` passa a ser o ator que foi clicado.
        const code = `CapivaraModBuilder.Hats.on('event_whenthisspriteclicked', async (clicked) => { if (!clicked || clicked.isStage) return; const util = { target: clicked }; ${BLOCKS} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}whenbackdropswitches`, {
        message0: 'when backdrop switches to %1 %2 %3',
        args0: [
            {
                "type": "field_input",
                "name": "BACKDROP",
                "text": "backdrop1",
                "check": "String",
                "acceptsBlocks": true
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const BACKDROP = javascriptGenerator.valueToCode(block, 'BACKDROP');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        // 'EVENT_STAGE_SWITCH_BACKDROP' nao existe no VM; a troca chega via startHats('event_whenbackdropswitchesto', {BACKDROP})
        const code = `CapivaraModBuilder.Hats.on('event_whenbackdropswitchesto', async (stage, fields) => { if (!fields || String(fields.BACKDROP).toLowerCase() !== String(${BACKDROP}).toLowerCase()) return; const util = { target: Scratch.vm.runtime.getTargetForStage() }; ${BLOCKS} });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}whengreaterthan`, {
        message0: 'when %1 > %2 %3',
        args0: [
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    ["timer", "timer"],
                    ["loudness", "loudness"]
                ]
            },
            {
                "type": "field_number",
                "name": "VALUE",
                "check": "Number",
                "value": 10,
                "acceptsBlocks": true
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const TYPE = block.getFieldValue('TYPE');
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const getter = TYPE === 'timer'
            ? `Scratch.vm.runtime.ioDevices.clock.projectTimer()`
            : `(Scratch.vm.runtime.audioEngine && Scratch.vm.runtime.audioEngine.getLoudness ? Scratch.vm.runtime.audioEngine.getLoudness() : -1)`;
        const code = `(() => { let fired = false; Scratch.vm.runtime.on('BEFORE_EXECUTE', (async () => { const over = ${getter} > ${VALUE}; if (over && !fired) { fired = true; ${BLOCKS} } else if (!over) { fired = false; } })); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}whenclonestarts`, {
        message0: 'when I start as a clone %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 1,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        // targetWasCreated(novo, original): clone tem `original` definido. util.target = o clone que nasceu.
        const code = `Scratch.vm.runtime.on('targetWasCreated', async (newTarget, original) => { if (!original) return; const util = { target: newTarget }; ${BLOCKS} });`;
        return `${code}\n`;
    })
}

export default register;