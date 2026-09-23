<script>
    import Blockly from "blockly/core";
    import En from "blockly/msg/en";
    import { onMount, onDestroy } from "svelte";

    import BlocklyComponent from "$lib/svelte-blockly";
    import javascriptGenerator from "../../resources/javascriptGenerator";
    import { start as runtimeHelpers } from "../../resources/compiler";
    import util from "../../resources/util";

    import TestToolbox from "./TestToolbox.xml?raw";

    const en = {
        rtl: false,
        msg: { ...En },
    };

    const config = {
        toolbox: TestToolbox,
        collapse: false,
        comments: false,
        scrollbars: true,
        trashcan: false,
        renderer: "custom_renderer",
        zoom: {
            controls: true,
            wheel: true,
            startScale: 0.8,
            maxScale: 2,
            minScale: 0.5,
            scaleSpeed: 1.1,
        },
    };

    /** @type {import('blockly').Workspace} */
    let workspace;
    /** @type {HTMLDivElement} */
    let container;
    let results = [];
    let globalError = "";

    class RuntimeRequiredError extends Error {}
    function createSandboxCast() {
        const cast = {
            toNumber(value) {
                if (typeof value === "number") {
                    return Number.isNaN(value) ? 0 : value;
                }
                const n = Number(value);
                return Number.isNaN(n) ? 0 : n;
            },
            toBoolean(value) {
                if (typeof value === "boolean") return value;
                if (typeof value === "string") {
                    return !(
                        value === "" ||
                        value === "0" ||
                        value.toLowerCase() === "false"
                    );
                }
                return Boolean(value);
            },
            toString(value) {
                if (value !== null && typeof value === "object") {
                    try {
                        return JSON.stringify(value);
                    } catch {
                        return String(value);
                    }
                }
                return String(value);
            },
            toRgbColorObject(value) {
                if (typeof value === "string" && value.startsWith("#")) {
                    return {
                        r: parseInt(value.substring(1, 3), 16) || 0,
                        g: parseInt(value.substring(3, 5), 16) || 0,
                        b: parseInt(value.substring(5, 7), 16) || 0,
                    };
                }
                const num = Math.round(cast.toNumber(value));
                return {
                    r: (num >> 16) & 255,
                    g: (num >> 8) & 255,
                    b: num & 255,
                };
            },
            toRgbColorList(value) {
                const c = cast.toRgbColorObject(value);
                return [c.r, c.g, c.b];
            },
            isWhiteSpace(val) {
                return (
                    val === null ||
                    (typeof val === "string" && val.trim().length === 0)
                );
            },
            compare(v1, v2) {
                let n1 = Number(v1);
                let n2 = Number(v2);
                if (Number.isNaN(n1) || Number.isNaN(n2)) {
                    const s1 = String(v1).toLowerCase();
                    const s2 = String(v2).toLowerCase();
                    if (s1 < s2) return -1;
                    if (s1 > s2) return 1;
                    return 0;
                }
                if (n1 === Infinity && n2 === Infinity) return 0;
                if (n1 === -Infinity && n2 === -Infinity) return 0;
                return n1 - n2;
            },
            isInt(val) {
                if (typeof val === "number") return Number.isInteger(val);
                return `${val}`.indexOf(".") === -1;
            },
        };
        return cast;
    }

    function createSandboxScratch() {
        const bail = () => {
            throw new RuntimeRequiredError();
        };

        const handler = {
            get(target, prop) {
                if (prop === "then") return undefined;
                if (
                    prop === Symbol.toPrimitive ||
                    prop === "toString" ||
                    prop === "valueOf"
                ) {
                    return bail;
                }
                if (prop === "vm") bail();
                if (prop === "extensions") return { unsandboxed: true };
                if (prop === "Cast") return createSandboxCast();
                return new Proxy(function sandboxed() {}, handler);
            },
            apply() {
                return new Proxy(function sandboxed() {}, handler);
            },
        };

        return new Proxy(function Scratch() {}, handler);
    }

    function createExtensionSandbox(scratch) {
        const bail = () => {
            throw new RuntimeRequiredError();
        };

        const callLog = [];
        let callCount = 0;
        const MAX_CALLS = 500;

        const methods = {};
        const definitions = window.blocks || {};

        const proxy = new Proxy(function extension() {}, {
            get(target, prop) {
                if (prop === "then") return undefined;
                if (
                    prop === Symbol.toPrimitive ||
                    prop === "toString" ||
                    prop === "valueOf"
                ) {
                    return bail;
                }
                if (Object.prototype.hasOwnProperty.call(methods, prop))
                    return methods[prop];
                return bail;
            },
            apply() {
                bail();
            },
        });

        for (const id of Object.keys(definitions)) {
            const defineBlock = window.workspace
                ?.getAllBlocks(false)
                ?.find((b) => b.type === "blocks_define" && b.blockId_ === id);
            if (!defineBlock) continue;

            let body;
            try {
                body = javascriptGenerator.statementToCode(
                    defineBlock,
                    "BLOCKS",
                );
            } catch {
                continue;
            }

            let run;
            try {
                run = new Function(
                    "Scratch",
                    "extension",
                    "args",
                    `return (async () => { ${body} })();`,
                );
            } catch {
                continue;
            }

            const label =
                util.blockToName(definitions[id].fields || []) || `block_${id}`;

            methods[`block_${id}`] = async (args) => {
                if (++callCount > MAX_CALLS) {
                    throw new Error(
                        "Too many nested block calls (possible infinite recursion).",
                    );
                }
                const result = await run(scratch, proxy, args);
                callLog.push({ label, args, result });
                return result;
            };
        }

        return { extension: proxy, callLog };
    }

    function formatResult(value) {
        if (typeof value === "string") return `"${value}"`;
        if (value === undefined) return "undefined";
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }

    // For command blocks (no output of their own), show what each nested
    // custom-block call computed along the way instead of just "it ran".
    function formatLog(callLog) {
        return callLog
            .map((entry) => `${entry.label} → ${formatResult(entry.result)}`)
            .join("\n");
    }

    // Runs one top-level block/stack in its own sandbox and returns its outcome.
    async function testBlock(block) {
        let code;
        let isValue;
        try {
            const generated = javascriptGenerator.blockToCode(block);
            if (Array.isArray(generated)) {
                code = generated[0];
                isValue = true;
            } else {
                code = generated;
                isValue = false;
            }
        } catch (err) {
            return {
                state: "error",
                label: "Error",
                text: "Couldn't generate code: " + err.message,
            };
        }

        const wrapped = isValue
            ? `${runtimeHelpers}\nreturn (${code});`
            : `${runtimeHelpers}\n${code}\nreturn undefined;`;

        try {
            const scratch = createSandboxScratch();
            const { extension, callLog } = createExtensionSandbox(scratch);
            const fn = new Function(
                "Scratch",
                "extension",
                `return (async () => { ${wrapped} })();`,
            );
            const value = await fn(scratch, extension);

            if (isValue) {
                return {
                    state: "ok",
                    label: "Result",
                    text: formatResult(value),
                };
            } else if (callLog.length > 0) {
                return {
                    state: "ok",
                    label: "Operation log",
                    text: formatLog(callLog),
                };
            } else {
                return {
                    state: "ok",
                    label: "Result",
                    text: "Ran successfully (no return value).",
                };
            }
        } catch (err) {
            if (err instanceof RuntimeRequiredError) {
                return {
                    state: "runtime",
                    label: "Can't be tested here",
                    text: "Relies on the CapivaraMod/Scratch runtime (e.g. vm) — test it directly in CapivaraMod.",
                };
            }
            return {
                state: "error",
                label: "Error",
                text: "Runtime error: " + err.message,
            };
        }
    }

    // Positions each result card right under its block's current on-screen
    // spot (accounts for pan/zoom/drag since it reads real SVG rects), and
    // drops any result whose block no longer exists.
    let repositionQueued = false;
    function scheduleReposition() {
        if (repositionQueued) return;
        repositionQueued = true;
        requestAnimationFrame(() => {
            repositionQueued = false;
            updatePositions();
        });
    }

    function updatePositions() {
        if (!container || results.length === 0) return;
        const containerRect = container.getBoundingClientRect();
        results = results
            .map((r) => {
                const block = workspace?.getBlockById(r.id);
                const svgRoot = block?.getSvgRoot();
                if (!svgRoot) return null;
                const rect = svgRoot.getBoundingClientRect();
                return {
                    ...r,
                    top: rect.bottom - containerRect.top + 6,
                    left: rect.left - containerRect.left,
                    minWidth: Math.min(320, Math.max(160, rect.width)),
                };
            })
            .filter(Boolean);
    }

    let listenerAdded = false;
    $: if (workspace && !listenerAdded) {
        listenerAdded = true;
        workspace.addChangeListener(scheduleReposition);
    }

    onMount(() => {
        if (typeof window === "undefined") return;
        window.addEventListener("resize", scheduleReposition);
    });
    onDestroy(() => {
        if (typeof window === "undefined") return;
        window.removeEventListener("resize", scheduleReposition);
    });

    async function runTest() {
        if (!workspace) return;

        const topBlocks = workspace.getTopBlocks(true);
        if (topBlocks.length === 0) {
            globalError = "Drag a block into the workspace first.";
            results = [];
            return;
        }
        globalError = "";

        results = await Promise.all(
            topBlocks.map(async (block) => ({
                id: block.id,
                ...(await testBlock(block)),
            })),
        );
        scheduleReposition();
    }

    function clearWorkspace() {
        results = [];
        globalError = "";
        workspace?.clear();
    }
</script>

<div id="test-menu">
    <div class="blockly-container" bind:this={container}>
        <BlocklyComponent {config} locale={en} bind:workspace />

        <div class="toolbar">
            <div class="toolbar-text">
                <strong>Test blocks</strong>
                <span
                    >Drag one or more blocks from <b>Blocks</b>, fill in their
                    values, then press Test. Each result shows up right under
                    its own block.</span
                >
            </div>
            <div class="buttons">
                <button class="test" on:click={runTest}>Test</button>
                <button class="clear" on:click={clearWorkspace}>Clear</button>
            </div>
            {#if globalError}
                <p class="global-error">{globalError}</p>
            {/if}
        </div>

        {#each results as r (r.id)}
            <div
                class="card {r.state}"
                style="top: {r.top}px; left: {r.left}px; min-width: {r.minWidth}px;"
            >
                <span class="label">{r.label}</span>
                <pre>{r.text}</pre>
            </div>
        {/each}
    </div>
</div>

<style>
    #test-menu {
        height: 100%;
    }

    .blockly-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .toolbar {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 30;
        max-width: 320px;
        box-sizing: border-box;
        padding: 12px 14px;
        border-radius: 0.6em;
        background: #f4f4f4ee;
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    }

    :global(.dark) .toolbar {
        background: #222222ee;
        color: #fff;
    }

    .toolbar-text {
        display: flex;
        flex-direction: column;
        gap: 0.2em;
        margin-bottom: 0.6em;
    }

    .toolbar-text strong {
        font-size: 0.95rem;
    }

    .toolbar-text span {
        opacity: 0.75;
        font-size: 0.8rem;
        line-height: 1.3;
    }

    .buttons {
        display: flex;
        gap: 0.5em;
    }

    .buttons button {
        appearance: none;
        border: none;
        border-radius: 0.3em;
        padding: 0.5em 1em;
        font-weight: bold;
        cursor: pointer;
        font-size: 0.85rem;
    }

    .buttons .test {
        background: #4bf;
        color: #000;
    }

    .buttons .clear {
        background: #8884;
    }

    :global(.dark) .buttons .clear {
        color: #fff;
    }

    .global-error {
        margin: 0.6em 0 0;
        font-size: 0.85rem;
        color: #a30000;
    }

    :global(.dark) .global-error {
        color: #ff8a8a;
    }

    /* Floating result card, anchored right under its own block */
    .card {
        position: absolute;
        z-index: 20;
        max-width: 340px;
        max-height: 220px;
        overflow: auto;
        box-sizing: border-box;
        padding: 0.6em 0.8em;
        border-radius: 0.5em;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        pointer-events: auto;
    }

    .card .label {
        display: block;
        font-weight: bold;
        margin-bottom: 0.3em;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.05em;
    }

    .card pre {
        white-space: pre-wrap;
        word-break: break-word;
        margin: 0;
        font-family: "JetBrains Mono", monospace;
        font-size: 0.85rem;
    }

    .card.ok {
        background: #ffffff;
        color: #000000;
        width: fit-content;
        border: 1px solid #00000033;
    }

    .card.runtime {
        background: #fff3cd;
        color: #7a5b00;
        width: fit-content;
        border: 1px solid #7a5b0033;
    }

    .card.error {
        background: #ffffff;
        color: #600101;
        width: fit-content;
        border: 1px solid #d3131333;
    }
</style>
