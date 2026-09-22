import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';

const categoryPrefix = 'music_';
const categoryColor = '#ae29d6';

const SYNTH = `(window.__capivaraSynth || (window.__capivaraSynth = { ctx: new (window.AudioContext || window.webkitAudioContext)(), waveform: "sine", volume: 1, tempo: 60, voices: {}, midiAccess: null, midiOutput: null, noteToFreq: n => 440 * Math.pow(2, (n - 69) / 12) }))`;

const MIDI = `${SYNTH}`;

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
    registerBlock(`${categoryPrefix}playnote`, {
        message0: 'play note %1 for %2 beats',
        args0: [numberField('NOTE', 60), numberField('BEATS', 1)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NOTE = javascriptGenerator.valueToCode(block, 'NOTE');
        const BEATS = javascriptGenerator.valueToCode(block, 'BEATS');
        const code = `await (() => { const s = ${SYNTH}; const dur = ${BEATS} * (60 / s.tempo); const osc = s.ctx.createOscillator(); const gain = s.ctx.createGain(); osc.type = s.waveform; osc.frequency.value = s.noteToFreq(${NOTE}); gain.gain.value = s.volume; osc.connect(gain); gain.connect(s.ctx.destination); osc.start(); gain.gain.setTargetAtTime(0, s.ctx.currentTime + dur * 0.9, 0.05); osc.stop(s.ctx.currentTime + dur); return new Promise(done => setTimeout(done, dur * 1000)); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}playnotenowait`, {
        message0: 'start note %1',
        args0: [numberField('NOTE', 60)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NOTE = javascriptGenerator.valueToCode(block, 'NOTE');
        const code = `(() => { const s = ${SYNTH}; if (s.voices[${NOTE}]) return; const osc = s.ctx.createOscillator(); const gain = s.ctx.createGain(); osc.type = s.waveform; osc.frequency.value = s.noteToFreq(${NOTE}); gain.gain.value = s.volume; osc.connect(gain); gain.connect(s.ctx.destination); osc.start(); s.voices[${NOTE}] = { osc, gain }; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}stopnote`, {
        message0: 'stop note %1',
        args0: [numberField('NOTE', 60)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NOTE = javascriptGenerator.valueToCode(block, 'NOTE');
        const code = `(() => { const s = ${SYNTH}; const v = s.voices[${NOTE}]; if (!v) return; v.gain.gain.setTargetAtTime(0, s.ctx.currentTime, 0.05); v.osc.stop(s.ctx.currentTime + 0.2); delete s.voices[${NOTE}]; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}stopallnotes`, {
        message0: 'stop all notes',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(() => { const s = ${SYNTH}; Object.keys(s.voices).forEach(n => { const v = s.voices[n]; v.gain.gain.setTargetAtTime(0, s.ctx.currentTime, 0.05); v.osc.stop(s.ctx.currentTime + 0.2); }); s.voices = {}; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}setinstrument`, {
        message0: 'set instrument to %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "WAVE",
                "options": [
                    ["piano-like (sine)", "sine"],
                    ["organ-like (square)", "square"],
                    ["string-like (sawtooth)", "sawtooth"],
                    ["flute-like (triangle)", "triangle"]
                ]
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const WAVE = block.getFieldValue('WAVE');
        const code = `${SYNTH}.waveform = "${WAVE}";`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}resttime`, {
        message0: 'rest for %1 beats',
        args0: [numberField('BEATS', 1)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BEATS = javascriptGenerator.valueToCode(block, 'BEATS');
        const code = `await new Promise(done => setTimeout(done, ${BEATS} * (60 / ${SYNTH}.tempo) * 1000));`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}settempo`, {
        message0: 'set tempo to %1',
        args0: [numberField('TEMPO', 60)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEMPO = javascriptGenerator.valueToCode(block, 'TEMPO');
        const code = `${SYNTH}.tempo = ${TEMPO};`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}changetempo`, {
        message0: 'change tempo by %1',
        args0: [numberField('CHANGE', 20)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CHANGE = javascriptGenerator.valueToCode(block, 'CHANGE');
        const code = `(() => { const s = ${SYNTH}; s.tempo += ${CHANGE}; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}gettempo`, {
        message0: 'tempo',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `${SYNTH}.tempo`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}setvolume`, {
        message0: 'set music volume to %1 %%',
        args0: [numberField('VOLUME', 100)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VOLUME = javascriptGenerator.valueToCode(block, 'VOLUME');
        const code = `${SYNTH}.volume = Math.max(0, Math.min(1, ${VOLUME} / 100));`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}getvolume`, {
        message0: 'music volume',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Math.round(${SYNTH}.volume * 100)`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}playsound`, {
        message0: 'play sound %1 until done',
        args0: [textField('NAME', 'pop')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `await Scratch.vm.runtime.ext_scratch3_sound.playSoundAndWaitForFinish({ SOUND_MENU: ${NAME} }, { target: (Scratch.vm.runtime.getEditingTarget() || Scratch.vm.runtime.targets.find(t => !t.isStage)) });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}startsound`, {
        message0: 'start sound %1',
        args0: [textField('NAME', 'pop')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `Scratch.vm.runtime.ext_scratch3_sound.playSound({ SOUND_MENU: ${NAME} }, { target: (Scratch.vm.runtime.getEditingTarget() || Scratch.vm.runtime.targets.find(t => !t.isStage)) });`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}stopallsounds`, {
        message0: 'stop all sounds',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.stopAllSounds();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}midienable`, {
        message0: 'connect midi device %1 %2',
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
        const code = `await (async () => { const s = ${MIDI}; s.midiAccess = await navigator.requestMIDIAccess({ sysex: false }); ${BLOCKS} })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}midioutputs`, {
        message0: 'midi output devices',
        args0: [],
        output: "List",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(() => { const s = ${MIDI}; return s.midiAccess ? Array.from(s.midiAccess.outputs.values()).map(o => o.name) : []; })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}midiinputs`, {
        message0: 'midi input devices',
        args0: [],
        output: "List",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(() => { const s = ${MIDI}; return s.midiAccess ? Array.from(s.midiAccess.inputs.values()).map(i => i.name) : []; })()`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}midisetoutput`, {
        message0: 'set midi output to %1',
        args0: [textField('NAME', 'IAC Driver')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `(() => { const s = ${MIDI}; if (!s.midiAccess) return; s.midiOutput = Array.from(s.midiAccess.outputs.values()).find(o => o.name === ${NAME}) || null; })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}midisendnoteon`, {
        message0: 'send midi note on %1 velocity %2 channel %3',
        args0: [numberField('NOTE', 60), numberField('VELOCITY', 100), numberField('CHANNEL', 1)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NOTE = javascriptGenerator.valueToCode(block, 'NOTE');
        const VELOCITY = javascriptGenerator.valueToCode(block, 'VELOCITY');
        const CHANNEL = javascriptGenerator.valueToCode(block, 'CHANNEL');
        const code = `(() => { const s = ${MIDI}; if (!s.midiOutput) return; s.midiOutput.send([0x90 + (${CHANNEL} - 1), ${NOTE}, ${VELOCITY}]); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}midisendnoteoff`, {
        message0: 'send midi note off %1 channel %2',
        args0: [numberField('NOTE', 60), numberField('CHANNEL', 1)],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NOTE = javascriptGenerator.valueToCode(block, 'NOTE');
        const CHANNEL = javascriptGenerator.valueToCode(block, 'CHANNEL');
        const code = `(() => { const s = ${MIDI}; if (!s.midiOutput) return; s.midiOutput.send([0x80 + (${CHANNEL} - 1), ${NOTE}, 0]); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}midisendraw`, {
        message0: 'send raw midi message %1',
        args0: [textField('BYTES', '144, 60, 100')],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BYTES = javascriptGenerator.valueToCode(block, 'BYTES');
        const code = `(() => { const s = ${MIDI}; if (!s.midiOutput) return; s.midiOutput.send(String(${BYTES}).split(",").map(v => parseInt(v.trim(), 10))); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}whenmidimessage`, {
        message0: 'when midi message received %1 %2',
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
        const code = `(() => { const s = ${MIDI}; if (!s.midiAccess) return; Array.from(s.midiAccess.inputs.values()).forEach(input => { input.onmidimessage = (async (event) => { const status = event.data[0]; const note = event.data[1]; const velocity = event.data[2]; ${BLOCKS} }); }); })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}midimessagenote`, {
        message0: 'midi message note',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(typeof note !== "undefined" ? note : 0)`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}midimessagevelocity`, {
        message0: 'midi message velocity',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `(typeof velocity !== "undefined" ? velocity : 0)`;
        return [`${code}`, 0];
    })
}

export default register;