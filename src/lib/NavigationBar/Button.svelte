<script>
    import { createEventDispatcher } from "svelte";

    import NavIconUnknown from "$lib/images/nav/unknown.svg";
    /** @type {string?} */
    export let icon = null

    const dispatch = createEventDispatcher();

    function event() {
        dispatch("click");
    }
</script>

<button on:click={event}>
    {#if icon}
        <img src={icon} alt="Icon" />
    {/if}
    <b><slot /></b>
</button>

<style>
    img {
        height: 1.5rem;
        margin-right: 0.5rem;
        opacity: 0.8;
    }

    b {
        opacity: 0.8;
    }
    b:empty {
        margin-left: -0.5rem;
    }

    button {
        position: relative;

        height: 100%;
        padding: 0 0.75rem;

        display: flex;
        flex-direction: row;
        align-items: center;

        font-family: 'Noto Sans', sans-serif;
        font-weight: bold;
        font-size: 0.75rem;
        color: #000;
        background: transparent;
        cursor: pointer;
        border: 0;
        transition: background 0.3s cubic-bezier(0, 0, 0.3, 1);
    }
    button:hover {
        background: #fff4
    }
</style>