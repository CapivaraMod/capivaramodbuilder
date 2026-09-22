import Blockly from 'blockly/core';
import javascriptGenerator from '../javascriptGenerator';
import convertArgToBlock from '../argBlocks'

/**
 * @param {(block: Blockly.Block) => string} compileFunction 
 */
export function registerBlock(blockName, jsonData, compileFunction) {
    jsonData.type = blockName

    const blockObject = {
        init: function () {
            this.jsonInit(jsonData);
        },
        order: jsonData.order || 0, //custom block ordering system
        isDual: function () {
            return this.outputConnection && (this.previousConnection || this.nextConnection)
        }
    };

    // idk why i did it this way olo
    for (let message = 0; jsonData[`message${message}`]; message++) {
        if (jsonData[`args${message}`]) {
            const args = jsonData[`args${message}`]
            for (let idx = 0, arg; arg = args[idx]; idx++)
                args[idx] = convertArgToBlock(arg, jsonData.colour, blockName, blockObject)
        }
    }

    // register visual block
    Blockly.Blocks[blockName] = blockObject

    // register block compile function
    javascriptGenerator[blockName] = compileFunction;
}

export function registerMutator(mutatorName, ...args) {
    Blockly.Extensions.unregister(mutatorName)
    Blockly.Extensions.registerMutator(mutatorName, ...args);
}