<script>
    export let title = 'Unknown';

    export let activeTab = 0;
    export let tabs;
    export let handleTabClick; 
    export let registerTab;

    let id = registerTab();

    function handleClick() {
        handleTabClick(id)
    }
</script>

<div class:active={id === activeTab}>
    <button on:click={handleClick}>{title}</button>
    <div class="contents" style:left={`calc(-${id/tabs} * 100vw)`}><slot /></div>
</div>


<style>
    div {
        position: relative;
        height: 100%;
        flex: 1;
    }
    div.active {
        z-index: 2;
    }

    button {
        position: absolute;

        width: 100%;
        height: 2em;

        text-align: center;

        font-family: 'Noto Sans', sans-serif;
        font-weight: bold;
        font-size: 0.75rem;
        color: #000;
        background: #fff;
        cursor: pointer;
        border: 0;
        border-bottom: 4px solid #0002;
        box-sizing: border-box;
        transition: background 0.3s cubic-bezier(0, 0, 0.3, 1);
    }
    div.active button {
        background: #ddd;
    }

    :global(.dark) button {
        background: #222;
        color: #fff;
    }
    :global(.dark) div.active button {
        background: #444;
    }

    .contents {
        width: 100vw;
        height: calc(100% - 1.5em);
        position: absolute;
        display: block;
        bottom: 0;
        overflow: auto;
    }
    div:not(.active) .contents {
        display: none;
    }
</style>