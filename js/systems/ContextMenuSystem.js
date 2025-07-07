// --- Context Menu System ---
export class ContextMenuSystem {
    constructor() {
        this.menu = null;
        this.currentElement = null;
        this.currentDocumentId = null;
    }

    init() {
        this.createContextMenu();
        this.setupEventListeners();
    }

    createContextMenu() {
        this.menu = document.createElement('div');
        this.menu.className = 'context-menu';
        this.menu.innerHTML = `
            <div class="context-menu-item" data-action="open">
                <i class="bi bi-folder-open"></i>
                Abrir
            </div>
            <div class="context-menu-item" data-action="properties">
                <i class="bi bi-gear"></i>
                Propriedades
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" data-action="export">
                <i class="bi bi-download"></i>
                Exportar
            </div>
            <div class="context-menu-item" data-action="view-json">
                <i class="bi bi-filetype-json"></i>
                Ver JSON
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" data-action="tutorial">
                <i class="bi bi-question-circle"></i>
                Tutorial
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item danger" data-action="delete">
                <i class="bi bi-trash"></i>
                Excluir
            </div>
        `;
        document.body.appendChild(this.menu);
    }

    setupEventListeners() {
        // Clique nas opções do menu
        this.menu.addEventListener('click', (e) => {
            const item = e.target.closest('.context-menu-item');
            if (item) {
                const action = item.getAttribute('data-action');
                this.executeAction(action);
                this.hideMenu();
            }
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target)) {
                this.hideMenu();
            }
        });

        // Fechar menu ao pressionar Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideMenu();
            }
        });
    }

    showMenu(e, element, documentId) {
        e.preventDefault();
        this.currentElement = element;
        this.currentDocumentId = documentId;
        
        this.menu.style.display = 'block';
        this.menu.style.left = `${e.clientX}px`;
        this.menu.style.top = `${e.clientY}px`;
        
        // Ajustar posição se sair da tela
        const rect = this.menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            this.menu.style.left = `${e.clientX - rect.width}px`;
        }
        if (rect.bottom > window.innerHeight) {
            this.menu.style.top = `${e.clientY - rect.height}px`;
        }
    }

    hideMenu() {
        this.menu.style.display = 'none';
        this.currentElement = null;
        this.currentDocumentId = null;
    }

    executeAction(action) {
        if (!this.currentDocumentId) return;

        switch (action) {
            case 'open':
                // Simular clique no documento
                if (this.currentElement) {
                    this.currentElement.click();
                }
                break;
            case 'properties':
                // Abrir modal de propriedades
                if (window.editDocumentProperties) {
                    window.editDocumentProperties(this.currentDocumentId);
                }
                break;
            case 'export':
                // Exportar documento
                if (window.exportSingleDocument) {
                    window.exportSingleDocument(this.currentDocumentId);
                }
                break;
            case 'view-json':
                // Ver JSON
                if (window.viewDocumentJSON) {
                    window.viewDocumentJSON(this.currentDocumentId);
                }
                break;
            case 'tutorial':
                // Mostrar tutorial específico
                if (window.tutorialSystem) {
                    window.tutorialSystem.showSpecificTutorial('document-properties');
                }
                break;
            case 'delete':
                // Excluir documento
                if (window.deleteDocument) {
                    window.deleteDocument(this.currentDocumentId);
                }
                break;
        }
    }
}
