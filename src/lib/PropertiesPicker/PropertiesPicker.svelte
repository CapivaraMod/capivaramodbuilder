<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()

    export let properties = {
        name: "Extension",
        id: "extensionID",
        color: "#0fbd8c"
    }

    function update() {
        dispatch("update")
    }

    function validateName() {
        if (properties.name == "") properties.name = "Extension"
        if (properties.name.length > 20) properties.name = properties.name.substring(0, 20)
        properties.name = properties.name.replace("\n", " ")
        update()
    }
</script>

<div class="root vert">
    <div class="inner horiz">
        <div class="vert equal">
            <div class="bubble" style:background={properties.color} />
            <span class="name" contenteditable="plaintext-only" bind:innerText={properties.name} on:blur={validateName}></span>
        </div>
        <div class="vert equal">
            <span>ID: <input type="text" placeholder="extensionID" maxlength="20" bind:value={properties.id} on:blur={update}></span>
            <span>Color: <input type="color" bind:value={properties.color} on:blur={update}></span>
        </div>
    </div>
    <slot {properties} />
</div>

<style>
    .vert {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .horiz {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .equal {
        flex: 1;
        overflow: hidden;
    }

    .root {
        width: 100%;
        height: 100%;
        justify-content: center;
    }
    .inner {
        width: 30em;
    }

    .bubble {
        width: 8em;
        aspect-ratio: 1;
        box-sizing: border-box;
        border: .5em solid #0004;
        border-radius: 100%;
    }

    .name {
        font-size: 1.2em;
        font-weight: 500;
        background-color: #0002;
        padding: 0.1em 0.3em;
        border-radius: 0.2em;
        margin-top: 0.5em;
        max-width: 100%;
        box-sizing: border-box;
        outline: none;
    }
    :global(.dark) .name {
        background-color: #fff2;
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
    :global(.dark) input {
        color: #fff;
        background-color: rgb(95, 95, 95);
    }
    span {
        margin-top: 0.5rem;
    }
</style>