import { CONFIG } from '../config/appConfig.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { JSONCopySystem } from '../systems/JSONCopySystem.js';

// Gerenciador de eventos de menu e toolbar
export class MenuManager {
    constructor(documentManager, appStateManager, uiManager, editor, urlManager = null) {
        console.log('MenuManager constructor chamado');
        this.documentManager = documentManager;
        this.appStateManager = appStateManager;
        this.uiManager = uiManager;
        this.editor = editor;
        this.urlManager = urlManager;
        this.setupMenuEvents();
    }

    setupMenuEvents() {
        this.setupToolbarEvents();
        this.setupDropdownMenuEvents();
        this.setupDocumentPropertiesModal();
    }

    setupToolbarEvents() {
        const documentToolbar = document.querySelector('.document-toolbar');
        if (documentToolbar) {
            documentToolbar.addEventListener('click', (event) => {
                // Compartilhar documento (visualização base64)
                if (event.target.closest('#share-document-btn')) {
                    this.handleShareDocument();
                    return;
                }
                
                // Comandos normais da toolbar
                const target = event.target.closest('button[data-command]');
                if (target) {
                    event.preventDefault();
                    const command = target.dataset.command;
                    this.handleToolbarCommand(command);
                }
            });
        }

        // Format block select
        const formatBlockSelect = document.getElementById('formatBlockSelect');
        if (formatBlockSelect) {
            formatBlockSelect.addEventListener('change', (event) => {
                event.preventDefault();
                const value = event.target.value;
                this.editor.execCommand('formatBlock', `<${value}>`);
                this.editor.focus();
                this.updateToolbarState();
            });
        }

        // Menu Ver JSON
        const menuViewJson = document.getElementById('menu-view-json');
        if (menuViewJson) {
            menuViewJson.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Menu Ver JSON clicado');
                this.handleViewJSON();
            });
        }

        // Menu Exportar
        const menuExport = document.getElementById('menu-export');
        if (menuExport) {
            menuExport.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Menu Exportar clicado');
                this.handleExportDocument();
            });
        }
    }

    setupDropdownMenuEvents() {
        // Event delegation para dropdown menu actions
        document.addEventListener('click', (event) => {
            const dropdownItem = event.target.closest('.dropdown-item');
            if (dropdownItem && dropdownItem.closest('.navbar')) {
                this.handleDropdownAction(event, dropdownItem);
            }
        });
    }

    setupDocumentPropertiesModal() {
        const savePropertiesBtn = document.getElementById('save-properties-btn');
        if (savePropertiesBtn) {
            savePropertiesBtn.addEventListener('click', () => {
                this.handleSaveProperties();
            });
        }
    }

    handleShareDocument() {
        if (!this.appStateManager.currentDocumentId) {
            Swal.fire({
                icon: 'warning',
                title: 'Nenhum documento carregado',
                text: 'Abra ou crie um documento para compartilhar.',
                background: '#24282e',
                color: '#e0e6eb'
            });
            return;
        }

        const docData = this.documentManager.loadDocument(this.appStateManager.currentDocumentId);
        if (!docData) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao carregar documento',
                text: 'Não foi possível carregar o documento para compartilhar.',
                background: '#24282e',
                color: '#e0e6eb'
            });
            return;
        }

        // Compartilhamento: só o HTML do conteúdo, não o JSON inteiro
        const htmlContent = docData.content || '';
        const encoded = btoa(unescape(encodeURIComponent(htmlContent)));
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?view=1&doc=${encoded}`;
        
        Swal.fire({
            icon: 'info',
            title: 'Compartilhar Visualização',
            html: `<input type='text' class='form-control mb-2' value='${shareUrl}' readonly style='background:#222;color:#fff;'>
                   <small class='text-muted'>Copie o link acima para compartilhar a visualização deste documento.</small>`,
            background: '#24282e',
            color: '#e0e6eb'
        });
    }

    handleToolbarCommand(command) {
        if (command === 'createLink') {
            const existingUrl = document.queryCommandValue('createLink');
            const url = prompt('Digite a URL:', existingUrl || 'https://');
            if (url && url !== 'https://') {
                this.editor.execCommand(command, url);
            } else if (url === '') {
                this.editor.execCommand('unlink');
            }
        } else {
            this.editor.execCommand(command);
        }
        this.editor.focus();
        this.updateToolbarState();
    }

    handleViewJSON() {
        if (!this.appStateManager.currentDocumentId) {
            Swal.fire({
                icon: 'warning',
                title: 'Nenhum documento carregado',
                text: 'Abra ou crie um documento para visualizar o JSON.',
                background: '#24282e',
                color: '#e0e6eb'
            });
            return;
        }

        const docData = this.documentManager.loadDocument(this.appStateManager.currentDocumentId);
        if (!docData) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao carregar documento',
                text: 'Não foi possível carregar o documento.',
                background: '#24282e',
                color: '#e0e6eb'
            });
            return;
        }

        this.uiManager.showJSONModal(docData);
    }

    handleDropdownAction(event, item) {
        const command = item.dataset.command;
        const value = item.dataset.value;
        const id = item.id;

        console.log('handleDropdownAction:', { command, value, id });

        // Handle specific menu item IDs
        if (id === 'menu-new-document') {
            event.preventDefault();
            this.showNewDocumentPrompt();
        } else if (id === 'menu-save-document') {
            event.preventDefault();
            this.saveCurrentDocument();
        } else if (id === 'menu-delete-document') {
            event.preventDefault();
            this.deleteCurrentDocument();
        } else if (id === 'menu-export') {
            event.preventDefault();
            this.handleExportDocument();
        } else if (id === 'menu-toggle-sidebar') {
            event.preventDefault();
            this.appStateManager.isSidebarVisible = !this.appStateManager.isSidebarVisible;
            this.uiManager.toggleSidebar(this.appStateManager.isSidebarVisible);
        } else if (id === 'menu-view-dashboard') {
            event.preventDefault();
            if (this.urlManager) {
                this.urlManager.navigateToDashboard();
            } else {
                this.uiManager.showView('dashboard');
                this.appStateManager.currentDocumentId = null;
                this.uiManager.highlightActiveDocument(null);
            }
        } else if (id === 'menu-view-settings') {
            event.preventDefault();
            if (this.urlManager) {
                this.urlManager.navigateToSettings();
            } else {
                this.uiManager.showView('settings');
                this.appStateManager.currentDocumentId = null;
                this.uiManager.highlightActiveDocument(null);
            }
        }
        // Handle data-command attributes
        else if (command) {
            event.preventDefault();
            this.handleToolbarCommand(command);
        }
    }

    handleSaveProperties() {
        const docId = document.getElementById('edit-doc-id').value;
        const newName = document.getElementById('document-name-input').value.trim();
        const newCategory = document.getElementById('document-category-input').value.trim() || 'Sem Categoria';
        const newTagsString = document.getElementById('document-tags-input').value.trim();
        const newTags = newTagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        if (!newName) {
            alert('O nome do documento não pode estar vazio.');
            return;
        }

        const currentDoc = this.documentManager.loadDocument(docId);
        if (currentDoc) {
            this.documentManager.saveDocument(docId, currentDoc.content, newName, newCategory, newTags);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('document-properties-modal'));
            modal.hide();
            
            this.uiManager.updateDocumentList();
            this.uiManager.renderDocumentCards();
            this.uiManager.updateCategoryTabs();
            this.uiManager.updateDashboardStats(); // Atualiza estatísticas após editar propriedades
            
            if (this.appStateManager.currentDocumentId === docId) {
                document.title = `${newName} - DocumentApp`;
            }
            
            console.log(`Propriedades do documento '${docId}' atualizadas.`);
        }
    }

    showNewDocumentPrompt() {
        console.log('showNewDocumentPrompt chamado');
        const docName = prompt('Digite o nome do novo documento:', `Documento Sem Título`);
        if (docName === null) return;

        let category = prompt('Digite a categoria do documento (opcional, ex: Fluxos de Trabalho, Pessoal, Pesquisa):', 'Sem Categoria');
        if (category === null) category = 'Sem Categoria';

        const newDoc = this.documentManager.createDocument(docName, category.trim() || 'Sem Categoria');
        this.uiManager.updateDocumentList();
        this.uiManager.updateCategoryTabs();
        this.uiManager.updateDashboardStats(); // Atualiza estatísticas após criar novo documento
        
        if (this.urlManager) {
            this.urlManager.navigateToDocument(newDoc.id);
        } else {
            this.loadAndDisplayDocument(newDoc.id);
        }
    }

    saveCurrentDocument() {
        if (this.appStateManager.currentDocumentId && this.appStateManager.isDocumentDirty) {
            const content = this.editor.getContent();
            this.documentManager.saveDocument(this.appStateManager.currentDocumentId, content);
            this.appStateManager.isDocumentDirty = false;
            const saveButton = document.getElementById('save-button');
            if (saveButton) saveButton.disabled = true;
            this.uiManager.updateDocumentList();
            this.uiManager.updateDashboardStats(); // Atualiza estatísticas após salvar documento
        }
    }

    deleteCurrentDocument() {
        if (this.appStateManager.currentDocumentId) {
            const doc = this.documentManager.loadDocument(this.appStateManager.currentDocumentId);
            if (doc) {
                Swal.fire({
                    title: 'Tem certeza?',
                    text: `Você está prestes a excluir o documento "${doc.name}". Esta ação não pode ser desfeita.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Sim, excluir',
                    cancelButtonText: 'Cancelar',
                    background: '#23272b',
                    customClass: { popup: 'swal2-dark' },
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.documentManager.deleteDocument(this.appStateManager.currentDocumentId);
                        this.uiManager.updateDocumentList();
                        this.uiManager.updateCategoryTabs();
                        this.uiManager.renderDocumentCards();
                        this.uiManager.updateDashboardStats(); // Atualiza estatísticas após excluir documento
                        this.appStateManager.currentDocumentId = null;
                        this.editor.setContent('');
                        this.uiManager.highlightActiveDocument(null);
                        
                        if (this.urlManager) {
                            this.urlManager.navigateToDashboard();
                        } else {
                            this.uiManager.showView('dashboard');
                        }
                        Swal.fire({
                            title: 'Excluído!',
                            text: 'Documento excluído com sucesso.',
                            icon: 'success',
                            background: '#23272b',
                            customClass: { popup: 'swal2-dark' },
                        });
                    }
                });
            }
        }
    }

    loadAndDisplayDocument(id) {
        if (this.urlManager) {
            // Se URLManager existe, usa ele para navegação
            this.urlManager.navigateToDocument(id);
        } else {
            // Fallback para o método tradicional
            const doc = this.documentManager.loadDocument(id);
            if (doc) {
                this.editor.setContent(doc.content);
                this.appStateManager.currentDocumentId = id;
                this.appStateManager.isDocumentDirty = false;
                const saveButton = document.getElementById('save-button');
                if (saveButton) saveButton.disabled = true;
                this.uiManager.showView('editor');
                this.uiManager.highlightActiveDocument(id);
                document.title = `${doc.name} - DocumentApp`;
                this.updateToolbarState();
            }
        }
    }

    updateToolbarState() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const parentElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
                ? range.commonAncestorContainer.parentElement
                : range.commonAncestorContainer;

            const editorElement = document.querySelector('.document-editor');
            if (editorElement && (editorElement.contains(parentElement) || parentElement === editorElement)) {
                const blockElement = parentElement.closest('h1, h2, h3, h4, h5, h6, p, div') || parentElement;
                const tagName = blockElement.tagName ? blockElement.tagName.toLowerCase() : 'p';
                const formatBlockSelect = document.getElementById('formatBlockSelect');
                if (formatBlockSelect) {
                    formatBlockSelect.value = tagName;
                }
            }
        }
    }

    handleExportDocument() {
        console.log('handleExportDocument chamado');
        
        // Verificar se há um documento carregado
        if (!this.appStateManager.currentDocumentId) {
            Swal.fire({
                icon: 'warning',
                title: 'Nenhum documento carregado',
                text: 'Abra ou crie um documento para exportar.',
                background: '#24282e',
                color: '#e0e6eb'
            });
            return;
        }

        // Navegar para view de exportação
        if (this.urlManager) {
            // Se há URLManager, usar navegação por URL
            this.urlManager.navigateToExport();
        } else {
            // Senão, usar navegação direta
            this.uiManager.showView('export');
        }
    }
}
