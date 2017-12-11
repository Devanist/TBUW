export default function appendEditorRootSection () {
    const editorRoot = document.createElement('section');
    editorRoot.style.display = "inline-block";
    editorRoot.style.verticalAlign = "top";
    editorRoot.id = "editorRoot";
    document.body.appendChild(editorRoot);
    return editorRoot;
}
