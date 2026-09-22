<script>
    import beautify from "js-beautify";
    import CodePreview from "$lib/CodePreview/CodePreview.svelte";

    export let code

    function copyCode() {
        navigator.clipboard.writeText(beautify.js(code, {
            indent_size: 4,
            space_in_empty_paren: true,
        }))
    }

    function testCode() {
        window.open(
            "https://studio.penguinmod.com/editor?extension=" +
            encodeURIComponent("data:text/plain;base64," + btoa(code)), '_blank'
        ).focus();
    }
</script>

<div class="root horiz">
    <div class="inner vert">
        <div class="code">
            <CodePreview {code} />
        </div>
        <div class="horiz">
            <button on:click={copyCode}>Copy</button>
            <!--<button on:click={testCode}>Test</button>-->
        </div>
        <b style:color="red">Make sure to run the extension unsandboxed.</b>
    </div>
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

    .root {
        width: 100%;
        height: 100%;
        justify-content: center;
    }
    .inner {
        width: 50%;
        gap: 1em;
    }

    .code {
        width: 100%;
        height: 480px;
    }
</style>