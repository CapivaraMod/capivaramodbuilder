/** @param {import('blockly').Workspace} workspace */
function register(workspace) {
    workspace.registerButtonCallback("variables_register", () => {
        window.modals['createVariable'].toggle()
    });

    workspace.registerButtonCallback("variables_remove", () => {
        let v = prompt("temporary delete variable prompt (put variable name here)")
        if (v != "") {
            delete window.variables[v]
            workspace.refreshToolboxSelection()
        }
    });
}

export default register;