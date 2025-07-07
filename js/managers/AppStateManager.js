import { CONFIG } from '../config/appConfig.js';

// Classe para gerenciar o estado da aplicação
export class AppStateManager {
    constructor() {
        this.state = {
            currentDocumentId: null,
            isDocumentDirty: false,
            isAutoSaveEnabled: true,
            isSidebarVisible: true,
            currentView: 'dashboard',
            currentCategoryFilter: 'Todos',
            currentSearchTerm: '',
            currentSortOrder: 'lastModifiedDesc'
        };
        
        this.loadState();
    }

    // Carrega o estado do localStorage
    loadState() {
        this.state.isAutoSaveEnabled = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTO_SAVE) !== 'false';
        this.state.isSidebarVisible = localStorage.getItem(CONFIG.STORAGE_KEYS.SIDEBAR_VISIBILITY) !== 'false';
        this.state.currentView = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_VIEW) || 'dashboard';
    }

    // Salva o estado no localStorage
    saveState() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.AUTO_SAVE, this.state.isAutoSaveEnabled);
        localStorage.setItem(CONFIG.STORAGE_KEYS.SIDEBAR_VISIBILITY, this.state.isSidebarVisible);
        localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_VIEW, this.state.currentView);
    }

    // Getters e setters para o estado
    get currentDocumentId() { return this.state.currentDocumentId; }
    set currentDocumentId(value) { this.state.currentDocumentId = value; }

    get isDocumentDirty() { return this.state.isDocumentDirty; }
    set isDocumentDirty(value) { this.state.isDocumentDirty = value; }

    get isAutoSaveEnabled() { return this.state.isAutoSaveEnabled; }
    set isAutoSaveEnabled(value) { 
        this.state.isAutoSaveEnabled = value;
        localStorage.setItem(CONFIG.STORAGE_KEYS.AUTO_SAVE, value);
    }

    get isSidebarVisible() { return this.state.isSidebarVisible; }
    set isSidebarVisible(value) { 
        this.state.isSidebarVisible = value;
        localStorage.setItem(CONFIG.STORAGE_KEYS.SIDEBAR_VISIBILITY, value);
    }

    get currentView() { return this.state.currentView; }
    set currentView(value) { 
        this.state.currentView = value;
        localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_VIEW, value);
    }

    get currentCategoryFilter() { return this.state.currentCategoryFilter; }
    set currentCategoryFilter(value) { this.state.currentCategoryFilter = value; }

    get currentSearchTerm() { return this.state.currentSearchTerm; }
    set currentSearchTerm(value) { this.state.currentSearchTerm = value; }

    get currentSortOrder() { return this.state.currentSortOrder; }
    set currentSortOrder(value) { this.state.currentSortOrder = value; }
}
