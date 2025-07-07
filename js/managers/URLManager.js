// Sistema de gerenciamento de URLs para navegação
export class URLManager {
    constructor(appStateManager, uiManager, documentManager) {
        this.appStateManager = appStateManager;
        this.uiManager = uiManager;
        this.documentManager = documentManager;
        this.baseUrl = window.location.origin + window.location.pathname;
        
        this.init();
    }

    init() {
        console.log('URLManager: Initializing...');
        
        // Escuta mudanças na URL
        window.addEventListener('popstate', (event) => {
            this.handleURLChange();
        });

        // Aguarda um pouco para garantir que todos os componentes estejam prontos
        setTimeout(() => {
            console.log('URLManager: Processing initial URL after delay');
            this.handleURLChange();
        }, 100);
    }

    // Atualiza URL sem recarregar a página
    updateURL(view, params = {}) {
        const url = new URL(window.location);
        url.searchParams.set('view', view);
        
        console.log('URLManager: Updating URL to view:', view, 'with params:', params);
        
        // Remove parâmetros anteriores
        url.searchParams.delete('doc');
        url.searchParams.delete('category');
        url.searchParams.delete('search');
        
        // Adiciona novos parâmetros
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            }
        });

        // Atualiza URL sem recarregar
        window.history.pushState(
            { view, params }, 
            '', 
            url.toString()
        );
        
        console.log('URLManager: New URL:', url.toString());
    }

    // Processa mudanças na URL
    handleURLChange() {
        const url = new URL(window.location);
        const view = url.searchParams.get('view') || 'dashboard';
        const docId = url.searchParams.get('doc');
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');

        console.log('URLManager: handleURLChange called with:', { view, docId, category, search });
        console.log('URLManager: Current URL:', window.location.href);

        // Atualiza estado da aplicação baseado na URL
        switch (view) {
            case 'dashboard':
                this.uiManager.showView('dashboard');
                
                // Aplica filtro de categoria se especificado
                if (category) {
                    this.appStateManager.currentCategoryFilter = category;
                    this.uiManager.updateCategoryTabs();
                }
                
                // Aplica termo de busca se especificado
                if (search) {
                    this.appStateManager.currentSearchTerm = search;
                    const searchInput = document.getElementById('search-documents-input');
                    if (searchInput) searchInput.value = search;
                }
                
                this.uiManager.renderDocumentCards();
                break;

            case 'editor':
                console.log('URLManager: Editor view requested with docId:', docId);
                if (docId) {
                    // Carrega documento específico
                    const doc = this.documentManager.loadDocument(docId);
                    console.log('URLManager: Document loaded:', doc);
                    if (doc) {
                        this.loadDocument(docId);
                    } else {
                        console.warn('URLManager: Document not found:', docId);
                        // Documento não encontrado, volta para dashboard
                        this.navigateToDashboard();
                    }
                } else {
                    console.warn('URLManager: No docId provided for editor view');
                    // Sem documento especificado, volta para dashboard
                    this.navigateToDashboard();
                }
                break;

            case 'settings':
                this.uiManager.showView('settings');
                break;

            case 'import':
                this.uiManager.showView('import');
                break;

            case 'export':
                this.uiManager.showView('export');
                // Carrega documento atual na view de exportação
                if (this.appStateManager.currentDocumentId) {
                    const currentDoc = this.documentManager.loadDocument(this.appStateManager.currentDocumentId);
                    if (currentDoc && window.exportManager) {
                        window.exportManager.setCurrentDocument(currentDoc);
                    }
                }
                break;

            default:
                this.navigateToDashboard();
        }
    }

    // Métodos de navegação
    navigateToDashboard(category = null, search = null) {
        console.log('URLManager: Navigate to dashboard, category:', category, 'search:', search);
        const params = {};
        if (category && category !== 'Todos') params.category = category;
        if (search) params.search = search;
        
        this.updateURL('dashboard', params);
        this.uiManager.showView('dashboard');
        
        if (category) {
            this.appStateManager.currentCategoryFilter = category;
            this.uiManager.updateCategoryTabs();
        }
        
        if (search) {
            this.appStateManager.currentSearchTerm = search;
            const searchInput = document.getElementById('search-documents-input');
            if (searchInput) searchInput.value = search;
        }
        
        this.uiManager.renderDocumentCards();
    }

    navigateToDocument(docId) {
        console.log('URLManager: Navigate to document:', docId);
        this.updateURL('editor', { doc: docId });
        this.loadDocument(docId);
    }

    navigateToSettings() {
        console.log('URLManager: Navigate to settings');
        this.updateURL('settings');
        this.uiManager.showView('settings');
    }

    navigateToImport() {
        console.log('URLManager: Navigate to import');
        this.updateURL('import');
        this.uiManager.showView('import');
    }

    navigateToExport() {
        console.log('URLManager: Navigate to export');
        this.updateURL('export');
        this.uiManager.showView('export');
        
        // Carrega documento atual na view de exportação
        if (this.appStateManager.currentDocumentId) {
            const currentDoc = this.documentManager.loadDocument(this.appStateManager.currentDocumentId);
            if (currentDoc && window.exportManager) {
                window.exportManager.setCurrentDocument(currentDoc);
            }
        }
    }

    // Carrega documento e atualiza UI
    loadDocument(docId) {
        console.log('URLManager: loadDocument called with docId:', docId);
        const doc = this.documentManager.loadDocument(docId);
        console.log('URLManager: Document data loaded:', doc);
        
        if (doc && window.editor) {
            console.log('URLManager: Editor available, setting content');
            window.editor.setContent(doc.content);
            this.appStateManager.currentDocumentId = docId;
            this.appStateManager.isDocumentDirty = false;
            
            const saveButton = document.getElementById('save-button');
            if (saveButton) saveButton.disabled = true;
            
            this.uiManager.showView('editor');
            this.uiManager.highlightActiveDocument(docId);
            
            // Atualiza título da página
            document.title = `${doc.name} - Docs`;
            
            // Marca documento como último aberto
            this.documentManager.setLastOpenedDocument(docId);
            
            console.log('URLManager: Document loaded successfully');
        } else {
            console.error('URLManager: Failed to load document - doc:', !!doc, 'editor:', !!window.editor);
        }
    }

    // Atualiza URL quando filtros mudam
    updateFilters(category, search) {
        const currentView = new URL(window.location).searchParams.get('view') || 'dashboard';
        if (currentView === 'dashboard') {
            const params = {};
            if (category && category !== 'Todos') params.category = category;
            if (search) params.search = search;
            
            this.updateURL('dashboard', params);
        }
    }

    // Gera URL para compartilhamento
    generateShareableURL(docId) {
        const url = new URL(this.baseUrl);
        url.searchParams.set('view', 'editor');
        url.searchParams.set('doc', docId);
        return url.toString();
    }
}
