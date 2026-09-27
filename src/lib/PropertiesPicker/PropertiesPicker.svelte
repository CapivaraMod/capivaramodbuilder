<script>
    import { createEventDispatcher } from "svelte";
    import fileDialog from "../../resources/fileDialog";
    const dispatch = createEventDispatcher()

    export let properties = {
        name: "Extension",
        id: "extensionID",
        color: "#0fbd8c",
        icon: null
    }

    const ACCEPTED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/gif", "image/webp"];
    const ACCEPTED_EXT = ".svg,.png,.jpg,.jpeg,.gif,.webp";
    const MAX_ICON_BYTES = 1024 * 1024;

    let showIdWarning = false;
    let warningTimeout;
    let iconError = "";
    let iconErrorTimeout;

    function update() {
        dispatch("update")
    }

    function validateName() {
        if (properties.name == "") properties.name = "Extension"
        if (properties.name.length > 20) properties.name = properties.name.substring(0, 20)
        properties.name = properties.name.replace("\n", " ")
        update()
    }

    function handleIdInput(e) {
        const original = e.target.value;
        if (/\s/.test(original)) {
            const cleaned = original.replace(/\s/g, "");
            properties.id = cleaned;
            triggerIdWarning();
        } else {
            properties.id = original;
        }
    }

    function handleIdKeydown(e) {
        if (e.key === " ") {
            e.preventDefault();
            triggerIdWarning();
        }
    }

    function triggerIdWarning() {
        showIdWarning = true;
        clearTimeout(warningTimeout);
        warningTimeout = setTimeout(() => {
            showIdWarning = false;
        }, 2000);
    }

    function showIconError(message) {
        iconError = message;
        clearTimeout(iconErrorTimeout);
        iconErrorTimeout = setTimeout(() => {
            iconError = "";
        }, 3000);
    }

    async function importIcon() {
        const files = await fileDialog({ accept: ACCEPTED_EXT });
        if (!files || !files[0]) return;
        const file = files[0];

        // some browsers leave .type empty for less common extensions (older
        // Firefox/Safari with .webp, for example), so fall back to sniffing
        // the extension instead of rejecting the file outright
        const type = file.type || guessTypeFromName(file.name);
        if (!ACCEPTED_TYPES.includes(type)) {
            showIconError("Formato não suportado. Use SVG, PNG, JPG, GIF ou WEBP.");
            return;
        }
        if (file.size > MAX_ICON_BYTES) {
            showIconError("Imagem muito grande (máximo 1MB).");
            return;
        }

        try {
            properties.icon = await readAsDataURL(file);
            update();
        } catch {
            showIconError("Não foi possível ler essa imagem.");
        }
    }

    function guessTypeFromName(name) {
        const ext = name.split(".").pop().toLowerCase();
        return {
            svg: "image/svg+xml",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            webp: "image/webp"
        }[ext] || "";
    }

    function readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    function removeIcon(e) {
        e.stopPropagation();
        properties.icon = null;
        update();
    }
</script>

<div class="root vert">
    <div class="inner horiz">
        <div class="vert equal">
            <button
                type="button"
                id="icone-fundo"
                class="bubble"
                class:no-fill={properties.icon}
                style:background={properties.icon ? "transparent" : properties.color}
                on:click={importIcon}
                title="Importar ícone (SVG, PNG, JPG, GIF ou WEBP)"
            >
                {#if properties.icon}
                    <span class="icon-preview-wrap">
                        <img class="icon-preview" src={properties.icon} alt="" />
                    </span>
                    <span class="icon-remove" on:click={removeIcon} title="Remove icon">✕</span>
                {:else}
                    <span class="icon-hint">+</span>
                {/if}
            </button>
            {#if iconError}
                <div class="toast">{iconError}</div>
            {/if}
            <span class="name" contenteditable="plaintext-only" bind:innerText={properties.name} on:blur={validateName}></span>
        </div>
        <div class="vert equal">
            <span class="id-field">
                ID: <input
                    type="text"
                    placeholder="extensionID"
                    maxlength="20"
                    value={properties.id}
                    on:input={handleIdInput}
                    on:keydown={handleIdKeydown}
                    on:blur={update}
                >
                {#if showIdWarning}
                    <div class="toast">Spaces are not allowed in the ID</div>
                {/if}
            </span>
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

    .bubble.no-fill {
        border-color: transparent;
    }

    button.bubble {
        position: relative;
        padding: 0;
        cursor: pointer;
        overflow: visible;
    }

    .icon-preview-wrap {
        position: absolute;
        inset: 0;
        border-radius: 0;
        overflow: hidden;
        display: block;
    }

    .icon-preview {
        width: 100%;
        height: 100%;
        object-fit: contain;
        pointer-events: none;
    }

    .icon-hint {
        font-size: 2.5em;
        font-weight: 300;
        color: #fff9;
        pointer-events: none;
    }

    .icon-remove {
        position: absolute;
        top: -0.4em;
        right: -0.4em;
        width: 1.8em;
        height: 1.8em;
        line-height: 1.8em;
        text-align: center;
        border-radius: 100%;
        background: #c0392b;
        border: 0.15em solid var(--bg-color, #fff);
        color: #fff;
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;
        z-index: 1;
    }
    .icon-remove:hover {
        background: #e74c3c;
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

    .id-field {
        position: relative;
    }

    .toast {
        animation: fadeInOut 2s ease forwards;
    }

    #icone-fundo {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(0) translateY(5px); }
        10% { opacity: 1; transform: translateX(0) translateY(0); }
        85% { opacity: 1; }
        100% { opacity: 0; }
    }
</style>