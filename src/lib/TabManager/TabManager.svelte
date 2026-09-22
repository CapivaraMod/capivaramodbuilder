<script>
    let activeTab = 0;
    let tabs = 0;

    function handleTabClick(id) {
        activeTab = id
    }

    function registerTab() {
        tabs += 1
        return tabs - 1
    }
</script>

<div><slot {activeTab} {tabs} {handleTabClick} {registerTab} /></div>

<style>
    div {
        display: flex;
        height: 100%;
    }

    :global(.dark) div {
        background: #111;
        color: #fff;
    }
</style>