import { CONFIG } from '../config/appConfig.js';
import { debounce } from '../utils/dateUtils.js';

// Classe para gerenciar eventos da aplicação
export class EventManager {
    constructor(documentManager, appStateManager, uiManager, editor, urlManager = null) {
        this.documentManager = documentManager;
        this.appStateManager = appStateManager;
        this.uiManager = uiManager;
        this.editor = editor;
        this.urlManager = urlManager;
        this.debouncedSave = debounce(() => this.saveCurrentDocument(), CONFIG.AUTO_SAVE_DELAY);
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.setupEditorEvents();
        this.setupUIEvents();
        this.setupDocumentEvents();
        this.setupSearchAndFilters();
        this.setupSettingsEvents();
        this.setupCustomDocumentEvents();
    }

    setupEditorEvents() {
        const editorElement = document.querySelector('.document-editor');
        if (editorElement) {
            editorElement.addEventListener('input', () => {
                this.appStateManager.isDocumentDirty = true;
                const saveButton = document.getElementById('save-button');
                if (saveButton) saveButton.disabled = false;

                if (this.appStateManager.isAutoSaveEnabled) {
                    this.debouncedSave();
                }
            });

            editorElement.addEventListener('keyup', () => this.updateToolbarState());
            editorElement.addEventListener('mouseup', () => this.updateToolbarState());
        }

        document.addEventListener('selectionchange', () => this.updateToolbarState());
    }

    setupUIEvents() {
        // Botão de salvar
        const saveButton = document.getElementById('save-button');
        if (saveButton) {
            saveButton.addEventListener('click', () => this.saveCurrentDocument());
        }

        // Toggle auto-save
        const autoSaveToggle = document.getElementById('auto-save-toggle');
        const settingsAutoSaveToggle = document.getElementById('settings-auto-save-toggle');
        
        if (autoSaveToggle) {
            autoSaveToggle.addEventListener('change', () => {
                this.appStateManager.isAutoSaveEnabled = autoSaveToggle.checked;
                if (settingsAutoSaveToggle) settingsAutoSaveToggle.checked = autoSaveToggle.checked;
                console.log(`Auto-salvar: ${autoSaveToggle.checked ? 'Ativado' : 'Desativado'}`);
            });
        }

        if (settingsAutoSaveToggle) {
            settingsAutoSaveToggle.addEventListener('change', () => {
                this.appStateManager.isAutoSaveEnabled = settingsAutoSaveToggle.checked;
                if (autoSaveToggle) autoSaveToggle.checked = settingsAutoSaveToggle.checked;
                console.log(`Auto-salvar: ${settingsAutoSaveToggle.checked ? 'Ativado' : 'Desativado'} (das configurações)`);
            });
        }

        // Toggle sidebar
        const sidebarToggleButton = document.getElementById('sidebar-toggle-button');
        if (sidebarToggleButton) {
            sidebarToggleButton.addEventListener('click', () => {
                this.appStateManager.isSidebarVisible = !this.appStateManager.isSidebarVisible;
                this.uiManager.toggleSidebar(this.appStateManager.isSidebarVisible);
            });
        }

        // Links de navegação
        const newDocumentLink = document.getElementById('new-document-link');
        if (newDocumentLink) {
            newDocumentLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNewDocumentModal();
            });
        }

        const settingsLink = document.getElementById('settings-link');
        if (settingsLink) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.urlManager) {
                    this.urlManager.navigateToSettings();
                } else {
                    this.uiManager.showView('settings');
                    this.appStateManager.currentDocumentId = null;
                    this.uiManager.highlightActiveDocument(null);
                }
            });
        }

        const showDashboardLink = document.getElementById('show-dashboard-link');
        if (showDashboardLink) {
            showDashboardLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.urlManager) {
                    this.urlManager.navigateToDashboard();
                } else {
                    this.uiManager.showView('dashboard');
                    this.appStateManager.currentDocumentId = null;
                    this.uiManager.highlightActiveDocument(null);
                }
            });
        }

        const importDocumentLink = document.getElementById('import-document-link');
        if (importDocumentLink) {
            importDocumentLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.urlManager) {
                    this.urlManager.navigateToImport();
                } else {
                    this.uiManager.showView('import');
                    this.appStateManager.currentDocumentId = null;
                    this.uiManager.highlightActiveDocument(null);
                }
            });
        }
    }

    setupDocumentEvents() {
        // Event delegation para lista de documentos
        document.addEventListener('click', (e) => {
            const documentLink = e.target.closest('[data-document-id]');
            if (documentLink && documentLink.classList.contains('nav-link')) {
                e.preventDefault();
                const docId = documentLink.dataset.documentId;
                if (this.urlManager) {
                    this.urlManager.navigateToDocument(docId);
                } else {
                    this.loadAndDisplayDocument(docId);
                }
            }
        });

        // Event delegation para cartões de documento
        const documentCardsContainer = document.getElementById('document-cards-container');
        if (documentCardsContainer) {
            documentCardsContainer.addEventListener('click', (e) => {
                const card = e.target.closest('.document-card');
                if (!card) return;

                const docId = card.dataset.documentId;

                // Previne abertura do documento quando clicado no botão dropdown
                if (e.target.matches('.dropdown-toggle') || e.target.closest('.dropdown-toggle')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                // Previne abertura do documento quando clicado no menu dropdown
                if (e.target.closest('.dropdown-menu')) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                // Ações do dropdown
                const dropdownItem = e.target.closest('.dropdown-item');
                if (dropdownItem) {
                    e.preventDefault();
                    e.stopPropagation();
                    const action = dropdownItem.dataset.action;
                    const dropdownDocId = dropdownItem.dataset.documentId || docId;
                    
                    // Fechar o dropdown manualmente
                    const dropdown = dropdownItem.closest('.dropdown');
                    if (dropdown) {
                        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                        if (dropdownToggle) {
                            const bsDropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
                            if (bsDropdown) {
                                bsDropdown.hide();
                            }
                        }
                    }
                    
                    this.handleDocumentAction(action, dropdownDocId);
                    return;
                }

                // Abrir documento com clique direto no cartão (exceto nos elementos do dropdown)
                if (!e.target.closest('.dropdown')) {
                    if (this.urlManager) {
                        this.urlManager.navigateToDocument(docId);
                    } else {
                        this.loadAndDisplayDocument(docId);
                    }
                }
            });
        }

        // Event delegation para abas de categoria
        const documentTabsUl = document.getElementById('documentTabs');
        if (documentTabsUl) {
            documentTabsUl.addEventListener('click', (e) => {
                const categoryLink = e.target.closest('[data-category]');
                if (categoryLink) {
                    e.preventDefault();
                    this.appStateManager.currentCategoryFilter = categoryLink.dataset.category;
                    this.uiManager.renderDocumentCards();
                    this.uiManager.updateCategoryTabs();
                    this.uiManager.updateDashboardStats(); // Atualiza estatísticas ao mudar categoria
                    
                    // Atualiza URL se URLManager estiver disponível
                    if (this.urlManager) {
                        this.urlManager.updateFilters(
                            categoryLink.dataset.category,
                            this.appStateManager.currentSearchTerm
                        );
                    }
                }
            });
        }
    }

    setupSearchAndFilters() {
        const searchInput = document.getElementById('search-documents-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(() => {
                this.appStateManager.currentSearchTerm = searchInput.value;
                this.uiManager.renderDocumentCards();
                this.uiManager.updateDashboardStats(); // Atualiza estatísticas ao buscar
                
                // Atualiza URL se URLManager estiver disponível
                if (this.urlManager) {
                    this.urlManager.updateFilters(
                        this.appStateManager.currentCategoryFilter,
                        searchInput.value
                    );
                }
            }, 300));
        }

        const sortSelect = document.getElementById('sort-by-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.appStateManager.currentSortOrder = sortSelect.value;
                this.uiManager.renderDocumentCards();
                // Não precisa atualizar estatísticas aqui, pois a ordenação não altera os dados
            });
        }
    }

    setupSettingsEvents() {
        const clearAllDocumentsBtn = document.getElementById('clear-all-documents-btn');
        if (clearAllDocumentsBtn) {
            clearAllDocumentsBtn.addEventListener('click', () => {
                this.showClearAllDocumentsModal();
            });
        }

        const exportAllDocumentsBtn = document.getElementById('export-all-documents-btn');
        if (exportAllDocumentsBtn) {
            exportAllDocumentsBtn.addEventListener('click', () => {
                this.exportAllDocuments();
            });
        }

        const importDocumentsInput = document.getElementById('import-documents-input');
        const importDocumentsBtn = document.getElementById('import-documents-btn');
        
        if (importDocumentsInput) {
            importDocumentsInput.addEventListener('change', (e) => {
                if (importDocumentsBtn) {
                    importDocumentsBtn.disabled = !e.target.files.length;
                }
            });
        }

        if (importDocumentsBtn) {
            importDocumentsBtn.addEventListener('click', () => {
                this.importDocuments();
            });
        }
    }

    setupCustomDocumentEvents() {
        // Listener para eventos customizados de ações de documento
        document.addEventListener('documentAction', (e) => {
            const { action, documentId } = e.detail;
            this.handleDocumentAction(action, documentId);
        });
    }

    // Métodos auxiliares
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

    loadAndDisplayDocument(id) {
        const doc = this.documentManager.loadDocument(id);
        if (doc) {
            this.editor.setContent(doc.content);
            this.appStateManager.currentDocumentId = id;
            this.appStateManager.isDocumentDirty = false;
            const saveButton = document.getElementById('save-button');
            if (saveButton) saveButton.disabled = true;
            
            // Garante que mostra a view do editor
            this.uiManager.showView('editor');
            this.uiManager.highlightActiveDocument(id);
            document.title = `${doc.name} - Docs`;
            this.updateToolbarState();
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

    handleDocumentAction(action, docId) {
        switch (action) {
            case 'open':
                if (this.urlManager) {
                    this.urlManager.navigateToDocument(docId);
                } else {
                    this.loadAndDisplayDocument(docId);
                }
                break;
            case 'edit-properties':
                this.showEditPropertiesModal(docId);
                break;
            case 'delete':
                this.showDeleteDocumentModal(docId);
                break;
            default:
                console.warn('Ação desconhecida:', action);
        }
    }

    showNewDocumentModal() {
        Swal.fire({
            title: 'Novo Documento',
            html: `<input type="text" id="swal-new-doc-name" class="form-control mb-2" placeholder="Nome do documento">
                   <input type="text" id="swal-new-doc-category" class="form-control mb-2" placeholder="Categoria (opcional)">
                   <input type="text" id="swal-new-doc-tags" class="form-control" placeholder="Etiquetas, separadas por vírgula (opcional)">`,
            showCancelButton: true,
            confirmButtonText: 'Criar',
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById('swal-new-doc-name').value.trim();
                const category = document.getElementById('swal-new-doc-category').value.trim();
                const tags = document.getElementById('swal-new-doc-tags').value.split(',').map(t => t.trim()).filter(Boolean);
                if (!name) {
                    Swal.showValidationMessage('O nome do documento é obrigatório.');
                    return false;
                }
                return { name, category, tags };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const { name, category, tags } = result.value;
                const newDoc = this.documentManager.createDocument(name, category, tags);
                this.uiManager.updateDocumentList();
                this.uiManager.updateCategoryTabs();
                this.uiManager.updateDashboardStats(); // Atualiza estatísticas após criar novo documento
                
                if (this.urlManager) {
                    this.urlManager.navigateToDocument(newDoc.id);
                } else {
                    this.loadAndDisplayDocument(newDoc.id);
                }
            }
        });
    }

    showEditPropertiesModal(docId) {
        const doc = this.documentManager.loadDocument(docId);
        if (!doc) return;

        const modal = new bootstrap.Modal(document.getElementById('document-properties-modal'));
        document.getElementById('edit-doc-id').value = docId;
        document.getElementById('document-name-input').value = doc.name;
        document.getElementById('document-category-input').value = doc.category || '';
        document.getElementById('document-tags-input').value = doc.tags.join(', ');
        modal.show();
    }

    showDeleteDocumentModal(docId) {
        const doc = this.documentManager.loadDocument(docId);
        if (!doc) return;

        Swal.fire({
            title: 'Excluir documento?',
            text: `Tem certeza de que deseja excluir "${doc.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            background: '#23272b',
            customClass: { popup: 'swal2-dark' },
        }).then((result) => {
            if (result.isConfirmed) {
                this.documentManager.deleteDocument(docId);
                this.uiManager.updateDocumentList();
                this.uiManager.renderDocumentCards();
                this.uiManager.updateCategoryTabs();
                
                if (this.appStateManager.currentDocumentId === docId) {
                    this.appStateManager.currentDocumentId = null;
                    this.editor.setContent('');
                    this.uiManager.highlightActiveDocument(null);
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

    showClearAllDocumentsModal() {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você tem certeza absoluta de que deseja excluir TODOS os documentos? Esta ação não pode ser desfeita.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir tudo',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            customClass: { popup: 'swal2-dark' },
            background: '#23272b',
        }).then((result) => {
            if (result.isConfirmed) {
                this.documentManager.clearAllDocuments();
                this.appStateManager.currentDocumentId = null;
                this.uiManager.updateDocumentList();
                this.uiManager.renderDocumentCards();
                this.uiManager.updateCategoryTabs();
                this.uiManager.updateDashboardStats(); // Atualiza estatísticas ao limpar todos os documentos
                this.uiManager.showView('dashboard');
                
                Swal.fire({
                    title: 'Limpo!',
                    text: 'Todos os documentos locais foram limpos.',
                    icon: 'success',
                    background: '#23272b',
                    customClass: { popup: 'swal2-dark' },
                });
            }
        });
    }

    exportAllDocuments() {
        const allDocs = this.documentManager.getAllDocuments();
        const dataStr = JSON.stringify(allDocs, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document_app_export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Swal.fire({
            title: 'Exportado!',
            text: 'Todos os documentos exportados com sucesso!',
            icon: 'success',
            background: '#23272b',
            customClass: { popup: 'swal2-dark' },
        });
    }

    importDocuments() {
        const fileInput = document.getElementById('import-documents-input');
        const file = fileInput.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedDocs = JSON.parse(e.target.result);
                    if (!Array.isArray(importedDocs)) {
                        throw new Error("Formato JSON inválido. Esperava um array de documentos.");
                    }

                    importedDocs.forEach(doc => {
                        const newId = `doc-imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        this.documentManager.importDocument({ ...doc, id: newId });
                    });
                    
                    Swal.fire({
                        title: 'Importado!',
                        text: `Importado ${importedDocs.length} documentos com sucesso!`,
                        icon: 'success',
                        background: '#23272b',
                        customClass: { popup: 'swal2-dark' },
                    });
                    
                    this.uiManager.updateDocumentList();
                    this.uiManager.renderDocumentCards();
                    this.uiManager.updateCategoryTabs();
                    this.uiManager.updateDashboardStats(); // Atualiza estatísticas após importar documentos
                } catch (error) {
                    Swal.fire({
                        title: 'Erro!',
                        text: `Erro ao importar documentos: ${error.message}`,
                        icon: 'error',
                        background: '#23272b',
                        customClass: { popup: 'swal2-dark' },
                    });
                    console.error('Erro de importação:', error);
                } finally {
                    fileInput.value = '';
                    const importBtn = document.getElementById('import-documents-btn');
                    if (importBtn) importBtn.disabled = true;
                }
            };
            reader.readAsText(file);
        }
    }

    // Método para atualizar exportação quando documento muda
    updateExportView() {
        if (this.appStateManager.currentView === 'export' && this.appStateManager.currentDocumentId) {
            const currentDoc = this.documentManager.loadDocument(this.appStateManager.currentDocumentId);
            if (currentDoc && window.exportManager) {
                window.exportManager.setCurrentDocument(currentDoc);
            }
        }
    }
}
