import javascriptGenerator from '../javascriptGenerator';
import util from '../util';

const start = `
if (!Scratch.extensions.unsandboxed) {
    alert("This extension needs to be unsandboxed to run!")
    return
}

const CapivaraModBuilder = {
    Broadcasts: new function() {
        this.raw_ = {};
        this.register = (name, blocks) => {
            (this.raw_[name] = this.raw_[name] || []).push(blocks);
        };
        this.execute = async (name, util) => {
            const handlers = this.raw_[name];
            if (!handlers) return;
            await Promise.all(handlers.map(fn => fn(util)));
        };
    },

    Hats: new function() {
        this.listeners_ = {};
        this.patched_ = false;
        this.on = (opcode, callback) => {
            (this.listeners_[opcode] = this.listeners_[opcode] || []).push(callback);
            if (this.patched_) return;
            this.patched_ = true;
            const runtime = Scratch.vm.runtime;
            const original = runtime.startHats;
            const self = this;
            runtime.startHats = function (hatOpcode, fields, target) {
                const list = self.listeners_[hatOpcode];
                if (list) {
                    for (const fn of list.slice()) {
                        Promise.resolve().then(() => fn(target, fields)).catch(e => console.error(e));
                    }
                }
                return original.apply(this, arguments);
            };
        };
    },

    Variables: new function() {
        this.raw_ = {};
        this.set = (name, value) => {
            this.raw_[name] = value;
        };
        this.get = (name) => {
            return this.raw_[name] ?? null;
        }
    },

    Vector: class {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        static from(v) {
            if (v instanceof CapivaraModBuilder.Vector) return v
            if (v instanceof Array) return new CapivaraModBuilder.Vector(Number(v[0]), Number(v[1]))
            if (v instanceof Object) return new CapivaraModBuilder.Vector(Number(v.x), Number(v.y))
            return new CapivaraModBuilder.Vector()
        }

        add(v) {
            return new CapivaraModBuilder.Vector(this.x + v.x, this.y + v.y);
        }

        set(x, y) {
            return new CapivaraModBuilder.Vector(x ?? this.x, y ?? this.y)
        }
    },

    Utils: {
        setList: (list, index, value) => {
            list[index] = value;
            return list;
        },
        lists_foreach: {
            index: [0],
            value: [null],
            depth: 0
        },
        countString: (x, y) => {
            return y.length == 0 ? 0 : x.split(y).length - 1
        }
    }
};
`

// Exported so other tools (like the block test menu) can spin up a
// lightweight sandbox that mirrors the runtime helpers real extensions get.
export { start };

class Compiler {
    /**
     * Generates JavaScript code from the provided workspace & info.
     * @param {import('blockly').Workspace} workspace 
     * @param {object} properties
     * @returns {string} Generated code.
     */
    compile(workspace, properties) {
        const code = javascriptGenerator.workspaceToCode(workspace);

        const headerCode = [
            `/*`,
            `   Created with CapivaraModBuilder`,
            `   https://capivaramod.github.io/capivaramodbuilder`,
            `*/`,
            `(async function (Scratch) {`,
            `const variables = {};`,
            ``,
            start
        ];
        const classRegistry = {
            top: [
                `class Extension {`
            ],
            extensionInfo: {},
            bottom: [
                `}`,
                ``,
                `let extension = new Extension();`,
                `// code compiled from CapivaraModBuilder`
            ]
        }
        const footerCode = [
            `Scratch.extensions.register(extension);`,
            `})(Scratch);`
        ];

        if (properties.icon) {
            classRegistry.extensionInfo.menuIconURI = properties.icon;
        }
        classRegistry.extensionInfo.id = properties.id;
        classRegistry.extensionInfo.name = properties.name;
        classRegistry.extensionInfo.color1 = properties.color;
        classRegistry.extensionInfo.blocks = Object.entries(window.blocks ?? {}).map(([id, block]) => {
            return {
                opcode: `block_${id}`,
                text: util.blockToExtensionText(block.fields),
                blockType: block.type,
                arguments: Object.fromEntries(block.fields.filter(v => v.type !== 'label').map(v => {
                    switch (v.type) {
                        case 'string': {
                            return [v.id, {
                                type: "string",
                                defaultValue: v.default
                            }]
                        }
                        case 'number': {
                            return [v.id, {
                                type: "number",
                                defaultValue: Number(v.default) || 0
                            }]
                        }
                        case 'boolean': {
                            return [v.id, {
                                type: "Boolean"
                            }]
                        }
                        case 'color': {
                            return [v.id, {
                                type: "color",
                                defaultValue: v.default || "#ff0000"
                            }]
                        }
                        default: {
                            // fall back to a plain string argument instead of
                            // silently producing `undefined`, which used to
                            // crash Object.fromEntries and freeze the whole
                            // code preview for every block whenever an
                            // unhandled field type (e.g. color) was used.
                            return [v.id, {
                                type: "string",
                                defaultValue: v.default ?? ""
                            }]
                        }
                    }
                }))
            }
        })

        return [].concat(headerCode, classRegistry.top, [
            `getInfo() {`,
            `   return ${JSON.stringify(classRegistry.extensionInfo).substring(0, JSON.stringify(classRegistry.extensionInfo).length - 1)}}`,
            `}`,
        ], Object.entries(window.blocks ?? {}).map(([id, block]) => {
            const defineBlock = workspace.getTopBlocks().find(v => v.type == "blocks_define" && v.blockId_ == id)
            const blockCode = defineBlock ? javascriptGenerator.statementToCode(defineBlock, "BLOCKS") : ""
            // `util` = 2o argumento que o TurboWarp entrega (util.target = ator que executa o bloco)
            return `async block_${id}(args, util) { ${blockCode} }`
        }), classRegistry.bottom, code, footerCode).join('\n');
    }
}

export default Compiler;