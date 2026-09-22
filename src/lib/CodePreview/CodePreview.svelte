<script>
    import beautify from "js-beautify";
    import Prism from "prismjs";

    export let code;

    function formatCode(x) {
        x = beautify.js(x, {
            indent_size: 4,
            space_in_empty_paren: true,
        });

        x = Prism.highlight(x, Prism.languages.javascript);

        return x;
    }
</script>

<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism-tomorrow.min.css" />
</head>

<div class="outer">
    <pre class="inner">{@html formatCode(code)}</pre>
</div>

<style>
    .outer {
        background-color: #333;
        width: 100%;
        height: 100%;
        padding: 8px;
        box-sizing: border-box;
        color: #eee;
    }

    .inner {
        display: block;
        background-color: #222;
        width: 100%;
        height: 100%;
        padding: 4px;
        margin: 0;
        box-sizing: border-box;
        border-radius: 8px;
        overflow: auto;
        font-family: "JetBrains Mono";
        font-size: 12px;
    }
</style>
