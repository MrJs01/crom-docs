// Import modules
import { DocumentManager } from 'modules/DocumentManager.js';
import { Editor } from 'modules/Editor.js';

// Import utils
import { escapeHtml } from 'utils/escapeHtml.js';
import { checkSharedMode } from 'utils/sharedView.js';

// Import systems
import { TutorialSystem } from 'systems/TutorialSystem.js';
import { ContextMenuSystem } from 'systems/ContextMenuSystem.js';
import { JSONCopySystem } from 'systems/JSONCopySystem.js';
import EmailSystem from 'systems/EmailSystem.js';

// Import managers
import { AppStateManager } from 'managers/AppStateManager.js';
import { UIManager } from 'managers/UIManager.js';
import { EventManager } from 'managers/EventManager.js';
import { ImportManager } from 'managers/ImportManager.js';
import ExportManager from 'managers/ExportManager.js';
import { GlobalFunctionManager } from 'managers/GlobalFunctionManager.js';
import { MenuManager } from 'managers/MenuManager.js';
import { URLManager } from 'managers/URLManager.js';
import { LoadingManager } from 'managers/LoadingManager.js';

// Import configuration
import { CONFIG } from 'config/appConfig.js';

// Verifica modo de visualização compartilhada
try {
    checkSharedMode();
} catch (error) {
    // Modo visualização ativado - não executa mais nada
    console.log('Modo visualização ativado');
}
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar loading
    const loadingManager = new LoadingManager();
    loadingManager.showAppLoading();
    
    // Pequeno delay para mostrar o loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Inicializar todos os gerenciadores
    // Inicializar componentes principais
    const documentManager = new DocumentManager();
    const editorElement = document.querySelector('.document-editor');
    const editor = new Editor(editorElement);
    
    loadingManager.updateProgress(40, 'Inicializando interface...');
    
    // Inicializar gerenciadores de estado e UI
    const appStateManager = new AppStateManager();
    const uiManager = new UIManager(documentManager, appStateManager);
    
    // Inicializar gerenciador de URLs
    const urlManager = new URLManager(appStateManager, uiManager, documentManager);
    
    console.log('URLManager created:', urlManager);
    console.log('Current URL on init:', window.location.href);
    
    loadingManager.updateProgress(60, 'Configurando sistemas...');
    
    // Inicializar sistemas
    const tutorialSystem = new TutorialSystem();
    const contextMenuSystem = new ContextMenuSystem();
    
    // Definir variáveis globais para compatibilidade
    window.tutorialSystem = tutorialSystem;
    window.contextMenuSystem = contextMenuSystem;
    window.appStateManager = appStateManager;
    window.editor = editor;
    window.urlManager = urlManager;
    window.loadingManager = loadingManager;
    
    loadingManager.updateProgress(80, 'Inicializando funcionalidades...');
    
    // Inicializar sistemas
    tutorialSystem.init();
    contextMenuSystem.init();
    
    // Inicializar gerenciadores de funcionalidades
    console.log('Inicializando gerenciadores...');
    const importManager = new ImportManager(documentManager, uiManager);
    const exportManager = new ExportManager();
    const emailSystem = new EmailSystem();
    const globalFunctionManager = new GlobalFunctionManager(documentManager, uiManager);
    const eventManager = new EventManager(documentManager, appStateManager, uiManager, editor, urlManager);
    const menuManager = new MenuManager(documentManager, appStateManager, uiManager, editor, urlManager);
    console.log('MenuManager inicializado:', menuManager);
    
    // Tornar URLManager disponível globalmente para outros managers
    window.eventManager = eventManager;
    window.menuManager = menuManager;
    window.exportManager = exportManager;
    window.emailSystem = emailSystem;
    window.documentManager = documentManager;
    window.appStateManager = appStateManager;
    window.uiManager = uiManager;
    
    loadingManager.updateProgress(90, 'Finalizando configuração...');
    
    // Sincronizar toggles de auto-save
    const autoSaveToggle = document.getElementById('auto-save-toggle');
    const settingsAutoSaveToggle = document.getElementById('settings-auto-save-toggle');
    if (autoSaveToggle) autoSaveToggle.checked = appStateManager.isAutoSaveEnabled;
    if (settingsAutoSaveToggle) settingsAutoSaveToggle.checked = appStateManager.isAutoSaveEnabled;
    
    // Aplicar estado inicial da sidebar
    uiManager.toggleSidebar(appStateManager.isSidebarVisible, false);
    
    // Carregar e exibir documentos
    uiManager.updateDocumentList();
    uiManager.updateCategoryTabs();
    
    // URL Manager vai gerenciar a navegação inicial
    // Não precisamos mais da lógica de navegação manual aqui
    
    loadingManager.hideAppLoading();
});

//# sourceMappingURL=app.js.map