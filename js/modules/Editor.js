export class Editor {
    constructor(editorElement) {
        if (!editorElement) {
            throw new Error("Editor element not provided.");
        }
        this.editorElement = editorElement;
    }

    setContent(htmlContent) {
        this.editorElement.innerHTML = htmlContent;
    }

    getContent() {
        return this.editorElement.innerHTML;
    }

    // Optional: Methods to execute commands (e.g., bold, italic)
    // For now, contenteditable itself handles basic rich text via browser shortcuts (Ctrl+B, etc.)
    // If a toolbar were added, these methods would be useful.
    execCommand(command, value = null) {
        document.execCommand(command, false, value);
    }

    // Focus the editor
    focus() {
        this.editorElement.focus();
    }
}