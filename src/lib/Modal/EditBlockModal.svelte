<script>
    import Modal from "./Modal.svelte";
    import util from "../../resources/util";

    let id = "editblock";

    import Blockly from "blockly/core";

    import En from "blockly/msg/en";
    import "blockly/blocks";
    import "blockly/javascript";

    import BlocklyComponent from "$lib/svelte-blockly";
    import { onMount } from "svelte";
    /** @type {Blockly.WorkspaceSvg} */
    let workspace;

    const en = {
        rtl: false,
        msg: {
            ...En,
        },
    };

    const config = {
        scrollbars: false,
        readOnly: true,
        renderer: "custom_renderer",
        zoom: {
            controls: false,
            wheel: true,
            startScale: 0.8,
            maxScale: 2,
            minScale: 0.5,
            scaleSpeed: 1.1,
        },
    };

    function updateBlocks(data) {
        previewBlock.blockId_ = data.blockId;
        previewBlock.updateShape_();
        previewBlock.initSvg();
        previewBlock.render();
        requestAnimationFrame(() => {
            workspace.centerOnBlock(previewBlock.id);
        });

        //refresh workspace
        try {
            let workspaceG = window.workspace;
            let xml = Blockly.Xml.workspaceToDom(workspaceG);
            workspaceG.clear();
            Blockly.Xml.domToWorkspace(xml, workspaceG);
            workspaceG.refreshToolboxSelection();
        } catch {}
    }

    function saveBlock(data) {
        data.toggle();
        window.blocks[data.blockId] = data.tempBlock;
        updateBlocks(data);
    }

    let dragIndex = null;
    let overIndex = null;

    function moveField(data, from, to) {
        const fields = data.tempBlock.fields;
        if (to < 0 || to >= fields.length || from === to) return;

        const [field] = fields.splice(from, 1);
        fields.splice(to, 0, field);

        data.tempBlock = data.tempBlock;
        data.update();
        updateBlocks(data);
    }

    function onDragStart(e, index) {
        dragIndex = index;
        e.dataTransfer.effectAllowed = "move";
        // usa a linha inteira como imagem do arrasto
        const row = e.currentTarget.closest("tr");
        if (row) e.dataTransfer.setDragImage(row, 0, 0);
    }

    function onDragOver(e, index) {
        if (dragIndex === null) return;
        e.preventDefault();
        overIndex = index;
    }

    function onDrop(e, data, index) {
        e.preventDefault();
        if (dragIndex !== null) moveField(data, dragIndex, index);
        onDragEnd();
    }

    function onDragEnd() {
        dragIndex = null;
        overIndex = null;
    }

    let previewBlock;

    onMount(() => {
        previewBlock = workspace.newBlock("blocks_execute");

        const old = window.modals[id].update;
        window.modals[id].update = function () {
            old.call(this);
            updateBlocks(window.modals[id]);
        };

        addEventListener("resize", (ev) => {
            workspace.centerOnBlock(previewBlock.id);
        });
    });
</script>

<Modal {id} title="Edit Block" let:data>
    <div class="main">
        <div class="preview">
            <BlocklyComponent {config} locale={en} bind:workspace />
        </div>
        <div class="fields">
            <table class="fields">
                <tr>
                    <th>Type</th>
                    <th>Text</th>
                    <th><!-- options --></th>
                    <th><!-- buttons --></th>
                </tr>
                {#each data.tempBlock ? data.tempBlock.fields : [] as field, i (field.id ?? i)}
                    <tr
                        class:dragging={dragIndex === i}
                        class:over={overIndex === i && dragIndex !== i}
                        on:dragover={(e) => onDragOver(e, i)}
                        on:drop={(e) => onDrop(e, data, i)}
                    >
                        <td>
                            <select
                                value={data.tempBlock.fields[i].type}
                                on:change={(e) => {
                                    data.tempBlock.fields[i].type =
                                        e.target.value;
                                    data.update();
                                    updateBlocks(data);
                                }}
                            >
                                <option value="label">Label</option>
                                <option value="string">String</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean</option>
                                <option value="color">Color</option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={data.tempBlock.fields[i].text}
                                on:change={(e) => {
                                    data.tempBlock.fields[i].text =
                                        e.target.value;
                                    data.update();
                                    updateBlocks(data);
                                }}
                            />
                        </td>
                        <td>
                            {#if data.tempBlock.fields[i].type == "string"}
                                <input
                                    type="text"
                                    value={data.tempBlock.fields[i].default ??
                                        ""}
                                    placeholder="Default value"
                                    on:change={(e) => {
                                        data.tempBlock.fields[i].default =
                                            e.target.value;
                                        data.update();
                                        updateBlocks(data);
                                    }}
                                />
                            {:else if data.tempBlock.fields[i].type == "number"}
                                <input
                                    type="number"
                                    value={data.tempBlock.fields[i].default ??
                                        ""}
                                    placeholder="Default value"
                                    on:change={(e) => {
                                        data.tempBlock.fields[i].default =
                                            e.target.value;
                                        data.update();
                                        updateBlocks(data);
                                    }}
                                />
                            {:else if data.tempBlock.fields[i].type == "color"}
                                <input
                                    type="color"
                                    value={data.tempBlock.fields[i].default ?? "#ff0000"}
                                    on:change={(e) => {
                                        data.tempBlock.fields[i].default =
                                            e.target.value;
                                        data.update();
                                        updateBlocks(data);
                                    }}
                                />
                            {/if}
                        </td>
                        <td class="row-btns">
                            <span
                                class="handle"
                                draggable="true"
                                role="button"
                                tabindex="-1"
                                aria-label="Arrastar para reordenar"
                                on:dragstart={(e) => onDragStart(e, i)}
                                on:dragend={onDragEnd}>⋮⋮</span
                            >
                            <button
                                disabled={i === 0}
                                aria-label="Mover para cima"
                                on:click={() => moveField(data, i, i - 1)}
                                >↑</button
                            >
                            <button
                                disabled={i === data.tempBlock.fields.length - 1}
                                aria-label="Mover para baixo"
                                on:click={() => moveField(data, i, i + 1)}
                                >↓</button
                            >
                            <button
                                on:click={() => {
                                    data.tempBlock.fields.splice(i, 1);
                                    data.tempBlock = data.tempBlock;
                                    data.update();
                                    updateBlocks(data);
                                }}>Delete</button
                            >
                        </td>
                    </tr>
                {/each}
            </table>
        </div>
        <div class="bottom">
            <!--<button on:click={() => saveBlock(data)}>Save</button>-->
            <button
                on:click={() => {
                    data.tempBlock.fields.push({
                        type: "label",
                        text: "text",
                        id: util.randomHex(16),
                    });
                    data.tempBlock = data.tempBlock;
                    data.update();
                    updateBlocks(data);
                }}>Add field</button
            >
            <select
                value={(data.tempBlock ?? {}).type}
                on:change={(e) => {
                    data.tempBlock.type = e.target.value;
                    data.update();
                    updateBlocks(data);
                }}
            >
                <option value="command">Command</option>
                <option value="reporter">Reporter</option>
                <option value="Boolean">Boolean</option>
            </select>
        </div>
    </div>
</Modal>

<style>
    button {
        background: none;
        border: none;
        outline: none;
        color: inherit;
        font-family: inherit;
        padding: 0.2rem 0.5rem;
        font-size: inherit;
        border-radius: 1rem;
        background-color: #e0e0e0;
    }
    :global(.dark) button {
        color: #fff;
        background-color: rgb(95, 95, 95);
    }
    button:disabled {
        opacity: 0.4;
    }
    select {
        background: none;
        border: none;
        outline: none;
        color: inherit;
        font-family: inherit;
        padding: 0.2rem 0.5rem;
        font-size: inherit;
        border-radius: 1rem;
        background-color: #e0e0e0;
    }
    :global(.dark) select {
        color: #fff;
        background-color: rgb(95, 95, 95);
    }
    input {
        background: none;
        border: none;
        outline: none;
        color: inherit;
        font-family: inherit;
        padding: 0.2rem 0.5rem;
        font-size: inherit;
        border-radius: 1rem;
        background-color: #e0e0e0;
    }
    input:placeholder-shown {
        color: #000000a2;
    }
    :global(.dark) input:placeholder-shown {
        color: #ffffffa2;
    }
    :global(.dark) input {
        color: #fff;
        background-color: rgb(95, 95, 95);
    }
    .main {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 8px;
    }

    .preview {
        flex: 1;
    }

    .fields {
        flex: 2;
        overflow-y: auto;
    }

    .fields table {
        width: 100%;
    }

    .fields tr > *:nth-child(1) {
        width: 20%;
    }
    .fields tr > *:nth-child(2) {
        width: 30%;
    }
    .fields tr > *:nth-child(4) {
        float: right;
    }

    :is(input, select):only-child {
        width: 100%;
        box-sizing: border-box;
    }

    .row-btns {
        display: flex;
        align-items: center;
        gap: 0.3em;
        white-space: nowrap;
    }

    .row-btns button {
        min-width: 2em;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
    }
    .handle {
        cursor: grab;
        opacity: 0.6;
        padding: 0 0.3em;
        user-select: none;
    }

    tr.dragging {
        opacity: 0.4;
    }

    tr.over {
        outline: 2px solid #4bf;
        outline-offset: -2px;
    }

    .bottom {
    }
</style>