import { CONFIG } from '../config/appConfig.js';
import { timeAgo } from '../utils/dateUtils.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { JSONCopySystem } from '../systems/JSONCopySystem.js';

// Classe para gerenciar a interface do usuário
export class UIManager {
    constructor(documentManager, appStateManager) {
        this.documentManager = documentManager;
        this.appStateManager = appStateManager;
        this.elements = {};
        this.initializeElements();
    }

    initializeElements() {
        // Elementos principais
        this.elements.dashboardView = document.getElementById('dashboard-view');
        this.elements.editorView = document.getElementById('editor-view');
        this.elements.settingsView = document.getElementById('settings-view');
        this.elements.importDocumentView = document.getElementById('import-document-view');
        this.elements.exportDocumentView = document.getElementById('export-document-view');
        this.elements.sidebarElement = document.getElementById('sidebar');
        this.elements.mainLayoutContainer = document.getElementById('main-layout-container');
        this.elements.documentCardsContainer = document.getElementById('document-cards-container');
        this.elements.documentListUl = document.getElementById('document-list');
        this.elements.documentTabsUl = document.getElementById('documentTabs');
        this.elements.searchDocumentsInput = document.getElementById('search-documents-input');
        this.elements.sortBySelect = document.getElementById('sort-by-select');
        
        // Elementos de sistema info
        this.elements.systemInfoCard = document.getElementById('system-info-card');
        this.elements.systemInfoToggle = document.getElementById('system-info-toggle');
        this.elements.systemInfoContent = document.getElementById('system-info-content');
        
        this.initializeSystemInfo();
    }

    initializeSystemInfo() {
        // Carrega estado minimizado
        const isSystemInfoMinimized = localStorage.getItem(CONFIG.STORAGE_KEYS.SYSTEM_INFO_MINIMIZED) === 'true';
        if (isSystemInfoMinimized && this.elements.systemInfoContent) {
            this.elements.systemInfoContent.classList.add('minimized');
            this.elements.systemInfoToggle.querySelector('i').className = 'bi bi-plus';
        }

        // Event listeners para system info card
        if (this.elements.systemInfoToggle) {
            this.elements.systemInfoToggle.addEventListener('click', () => this.toggleSystemInfo());
        }
        
        if (this.elements.systemInfoCard) {
            this.elements.systemInfoCard.querySelector('.system-info-header')?.addEventListener('click', () => this.toggleSystemInfo());
        }
    }

    toggleSystemInfo() {
        const isMinimized = this.elements.systemInfoContent.classList.contains('minimized');
        if (isMinimized) {
            this.elements.systemInfoContent.classList.remove('minimized');
            this.elements.systemInfoToggle.querySelector('i').className = 'bi bi-dash';
            localStorage.setItem(CONFIG.STORAGE_KEYS.SYSTEM_INFO_MINIMIZED, 'false');
        } else {
            this.elements.systemInfoContent.classList.add('minimized');
            this.elements.systemInfoToggle.querySelector('i').className = 'bi bi-plus';
            localStorage.setItem(CONFIG.STORAGE_KEYS.SYSTEM_INFO_MINIMIZED, 'true');
        }
    }

    // Função para alternar entre views
    showView(viewName) {
        console.log('UIManager: showView called with:', viewName);
        console.log('UIManager: Elements available:', {
            dashboardView: !!this.elements.dashboardView,
            editorView: !!this.elements.editorView,
            settingsView: !!this.elements.settingsView,
            importDocumentView: !!this.elements.importDocumentView,
            exportDocumentView: !!this.elements.exportDocumentView
        });
        
        // Remove todas as classes de view do body
        document.body.classList.remove('dashboard-view', 'editor-view', 'settings-view', 'import-view', 'export-view');
        
        // Esconde todas as views primeiro
        this.elements.dashboardView.classList.add('d-none');
        this.elements.editorView.classList.add('d-none');
        this.elements.settingsView.classList.add('d-none');
        if (this.elements.importDocumentView) {
            this.elements.importDocumentView.classList.add('d-none');
        }
        if (this.elements.exportDocumentView) {
            this.elements.exportDocumentView.classList.add('d-none');
        }
        
        // Mostra a view solicitada
        switch(viewName) {
            case 'dashboard':
                console.log('UIManager: Showing dashboard view');
                this.elements.dashboardView.classList.remove('d-none');
                document.body.classList.add('dashboard-view');
                document.title = 'Docs';
                this.appStateManager.currentView = 'dashboard';
                this.updateDashboardStats();
                break;
            case 'editor':
                console.log('UIManager: Showing editor view');
                this.elements.editorView.classList.remove('d-none');
                document.body.classList.add('editor-view');
                this.appStateManager.currentView = 'editor';
                
                // Verificar se as classes foram aplicadas
                console.log('UIManager: Body classes after editor view:', document.body.classList.toString());
                console.log('UIManager: Editor view classes:', this.elements.editorView.classList.toString());
                break;
            case 'settings':
                this.elements.settingsView.classList.remove('d-none');
                document.body.classList.add('settings-view');
                document.title = 'Configurações - Docs';
                this.appStateManager.currentView = 'settings';
                break;
            case 'import':
                if (this.elements.importDocumentView) {
                    this.elements.importDocumentView.classList.remove('d-none');
                    document.body.classList.add('import-view');
                    document.title = 'Importar Documento - Docs';
                    this.appStateManager.currentView = 'import';
                }
                break;
            case 'export':
                if (this.elements.exportDocumentView) {
                    this.elements.exportDocumentView.classList.remove('d-none');
                    document.body.classList.add('export-view');
                    document.title = 'Exportar Documento - Docs';
                    this.appStateManager.currentView = 'export';
                    
                    // Conectar documento atual ao ExportManager
                    setTimeout(() => {
                        if (this.appStateManager.currentDocumentId && window.exportManager) {
                            const currentDoc = this.documentManager.loadDocument(this.appStateManager.currentDocumentId);
                            if (currentDoc) {
                                window.exportManager.setCurrentDocument(currentDoc);
                                console.log('UIManager: Documento conectado ao ExportManager:', currentDoc.name);
                            }
                        }
                    }, 100);
                }
                break;
        }
    }

    // Função para renderizar cartões de documento no dashboard
    renderDocumentCards() {
        const documents = this.documentManager.getDocumentsList();
        this.elements.documentCardsContainer.innerHTML = '';
        
        // Filtra documentos baseado no filtro de categoria atual
        let filteredDocs = documents;
        if (this.appStateManager.currentCategoryFilter !== 'Todos') {
            filteredDocs = documents.filter(doc => (doc.category || 'Sem Categoria') === this.appStateManager.currentCategoryFilter);
        }
        
        // Filtra por termo de busca se fornecido
        if (this.appStateManager.currentSearchTerm) {
            filteredDocs = filteredDocs.filter(doc => 
                doc.name.toLowerCase().includes(this.appStateManager.currentSearchTerm.toLowerCase()) ||
                doc.content.toLowerCase().includes(this.appStateManager.currentSearchTerm.toLowerCase()) ||
                doc.tags.some(tag => tag.toLowerCase().includes(this.appStateManager.currentSearchTerm.toLowerCase()))
            );
        }
        
        // Ordena documentos
        filteredDocs.sort((a, b) => {
            switch(this.appStateManager.currentSortOrder) {
                case 'nameAsc':
                    return a.name.localeCompare(b.name);
                case 'nameDesc':
                    return b.name.localeCompare(a.name);
                case 'lastModifiedAsc':
                    return new Date(a.lastModified) - new Date(b.lastModified);
                case 'lastModifiedDesc':
                default:
                    return new Date(b.lastModified) - new Date(a.lastModified);
            }
        });
        
        // Renderiza cartões de documento
        filteredDocs.forEach(doc => {
            const cardColumn = document.createElement('div');
            cardColumn.className = 'col-md-6 col-lg-4 mb-4';
            
            // Cria o card principal
            const documentCard = document.createElement('div');
            documentCard.className = 'document-card h-100';
            documentCard.setAttribute('data-document-id', doc.id);
            
            // Cria o corpo do card
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            
            // Cria header com título e dropdown
            const headerDiv = document.createElement('div');
            headerDiv.className = 'd-flex justify-content-between align-items-start mb-2';
            
            // Título
            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = doc.name;
            
            // Dropdown container
            const dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'dropdown';
            
            // Botão dropdown
            const dropdownButton = document.createElement('button');
            dropdownButton.className = 'btn btn-sm btn-outline-secondary dropdown-toggle';
            dropdownButton.type = 'button';
            dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
            dropdownButton.setAttribute('aria-expanded', 'false');
            
            // Event listener para prevenir propagação
            dropdownButton.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            // Ícone do dropdown
            const dropdownIcon = document.createElement('i');
            dropdownIcon.className = 'bi bi-three-dots';
            dropdownButton.appendChild(dropdownIcon);
            
            // Menu dropdown
            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu';
            
            // Itens do menu
            const menuItems = [
                { text: 'Abrir', action: 'open', classes: 'dropdown-item' },
                { text: 'Propriedades', action: 'edit-properties', classes: 'dropdown-item' },
                { text: 'divider', action: null, classes: null },
                { text: 'Excluir', action: 'delete', classes: 'dropdown-item text-danger' }
            ];
            
            menuItems.forEach(item => {
                const li = document.createElement('li');
                
                if (item.text === 'divider') {
                    const divider = document.createElement('hr');
                    divider.className = 'dropdown-divider';
                    li.appendChild(divider);
                } else {
                    const link = document.createElement('a');
                    link.className = item.classes;
                    link.href = '#';
                    link.textContent = item.text;
                    link.setAttribute('data-action', item.action);
                    link.setAttribute('data-document-id', doc.id);
                    
                    // Event listener para ações do dropdown
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Fechar dropdown
                        const dropdown = e.target.closest('.dropdown');
                        if (dropdown) {
                            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                            if (dropdownToggle) {
                                const bsDropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
                                if (bsDropdown) {
                                    bsDropdown.hide();
                                }
                            }
                        }
                        
                        // Disparar evento customizado para ser capturado pelo EventManager
                        const customEvent = new CustomEvent('documentAction', {
                            detail: {
                                action: item.action,
                                documentId: doc.id
                            }
                        });
                        document.dispatchEvent(customEvent);
                    });
                    
                    li.appendChild(link);
                }
                
                dropdownMenu.appendChild(li);
            });
            
            // Monta o dropdown
            dropdownDiv.appendChild(dropdownButton);
            dropdownDiv.appendChild(dropdownMenu);
            
            // Monta o header
            headerDiv.appendChild(title);
            headerDiv.appendChild(dropdownDiv);
            
            // Categoria
            const categoryP = document.createElement('p');
            categoryP.className = 'card-text';
            const categorySmall = document.createElement('small');
            categorySmall.className = 'text-muted';
            const categoryIcon = document.createElement('i');
            categoryIcon.className = 'bi bi-folder me-1';
            categorySmall.appendChild(categoryIcon);
            categorySmall.appendChild(document.createTextNode(doc.category || 'Sem Categoria'));
            categoryP.appendChild(categorySmall);
            
            // Data de modificação
            const dateP = document.createElement('p');
            dateP.className = 'card-text';
            const dateSmall = document.createElement('small');
            dateSmall.className = 'text-muted';
            const dateIcon = document.createElement('i');
            dateIcon.className = 'bi bi-clock me-1';
            dateSmall.appendChild(dateIcon);
            dateSmall.appendChild(document.createTextNode(timeAgo(doc.lastModified)));
            dateP.appendChild(dateSmall);
            
            // Tags (se existirem)
            let tagsP = null;
            if (doc.tags.length > 0) {
                tagsP = document.createElement('p');
                tagsP.className = 'card-text';
                const tagsSmall = document.createElement('small');
                tagsSmall.className = 'text-muted';
                
                doc.tags.forEach(tag => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-secondary me-1';
                    badge.textContent = tag;
                    tagsSmall.appendChild(badge);
                });
                
                tagsP.appendChild(tagsSmall);
            }
            
            // Monta o card
            cardBody.appendChild(headerDiv);
            cardBody.appendChild(categoryP);
            cardBody.appendChild(dateP);
            if (tagsP) {
                cardBody.appendChild(tagsP);
            }
            
            documentCard.appendChild(cardBody);
            cardColumn.appendChild(documentCard);
            
            // Event listener para abrir documento ao clicar no card
            documentCard.addEventListener('click', (e) => {
                // Não abrir se clicou no dropdown
                if (!e.target.closest('.dropdown')) {
                    const customEvent = new CustomEvent('documentAction', {
                        detail: {
                            action: 'open',
                            documentId: doc.id
                        }
                    });
                    document.dispatchEvent(customEvent);
                }
            });
            
            this.elements.documentCardsContainer.appendChild(cardColumn);
        });
        
        // Atualiza estatísticas
        this.updateDashboardStats();
    }

    // Atualiza estatísticas do dashboard
    updateDashboardStats() {
        const allDocuments = this.documentManager.getDocumentsList();
        const categories = this.documentManager.getAllCategories();
        
        // Filtra documentos baseado no filtro de categoria atual
        let filteredDocuments = allDocuments;
        if (this.appStateManager.currentCategoryFilter !== 'Todos') {
            filteredDocuments = allDocuments.filter(doc => 
                (doc.category || 'Sem Categoria') === this.appStateManager.currentCategoryFilter
            );
        }
        
        // Filtra por termo de busca se fornecido
        if (this.appStateManager.currentSearchTerm && this.appStateManager.currentSearchTerm.trim() !== '') {
            filteredDocuments = filteredDocuments.filter(doc => 
                doc.name.toLowerCase().includes(this.appStateManager.currentSearchTerm.toLowerCase()) ||
                (doc.content && doc.content.toLowerCase().includes(this.appStateManager.currentSearchTerm.toLowerCase())) ||
                (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(this.appStateManager.currentSearchTerm.toLowerCase())))
            );
        }
        
        // Conta palavras apenas dos documentos filtrados
        let totalWords = 0;
        filteredDocuments.forEach((doc, index) => {
            if (doc.content && typeof doc.content === 'string' && doc.content.trim() !== '') {
                // Contagem mais precisa de palavras
                let text = doc.content
                    .replace(/<[^>]*>/g, '') // Remove HTML
                    .replace(/&[^;]+;/g, ' ') // Remove entidades HTML
                    .replace(/[^\w\s\u00C0-\u017F\u0100-\u024F\u1E00-\u1EFF]/g, ' ') // Remove pontuação, mantém acentos
                    .replace(/\s+/g, ' ') // Normaliza espaços
                    .trim();
                
                if (text.length > 0) {
                    const words = text.split(/\s+/).filter(word => word.length > 0);
                    totalWords += words.length;
                }
            }
        });

        const totalDocumentsEl = document.getElementById('total-documents');
        const totalCategoriesEl = document.getElementById('total-categories');
        const totalWordsEl = document.getElementById('total-words');
        
        // Atualiza contadores com base nos documentos filtrados
        if (totalDocumentsEl) totalDocumentsEl.textContent = filteredDocuments.length;
        if (totalCategoriesEl) {
            // Se estiver filtrando por categoria específica, mostra 1, senão mostra o total
            const categoriesCount = this.appStateManager.currentCategoryFilter === 'Todos' 
                ? categories.length 
                : (filteredDocuments.length > 0 ? 1 : 0);
            totalCategoriesEl.textContent = categoriesCount;
        }
        if (totalWordsEl) {
            totalWordsEl.textContent = totalWords.toLocaleString();
        }
    }

    // Atualiza lista de documentos na sidebar
    updateDocumentList() {
        const documents = this.documentManager.getDocumentsList();
        this.elements.documentListUl.innerHTML = '';

        // Agrupa documentos por categoria
        const docsByCategory = documents.reduce((acc, doc) => {
            const category = doc.category || 'Sem Categoria';
            if (!acc[category]) acc[category] = [];
            acc[category].push(doc);
            return acc;
        }, {});

        // Ordena categorias alfabeticamente
        const sortedCategories = Object.keys(docsByCategory).sort();

        sortedCategories.forEach(category => {
            // Cria header da categoria
            const categoryHeader = document.createElement('li');
            categoryHeader.className = 'nav-item';
            categoryHeader.innerHTML = `
                <div class="sidebar-category-header">
                    <span class="sidebar-category-title">${category}</span>
                    <span class="sidebar-category-count">${docsByCategory[category].length}</span>
                </div>
            `;
            this.elements.documentListUl.appendChild(categoryHeader);

            // Adiciona documentos na categoria
            docsByCategory[category].forEach(doc => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                li.innerHTML = `
                    <a href="#" class="nav-link d-flex align-items-center py-2" data-document-id="${doc.id}">
                        <i class="bi bi-file-text me-2"></i>
                        <span class="sidebar-doc-name">${doc.name}</span>
                    </a>
                `;
                this.elements.documentListUl.appendChild(li);
            });
        });
    }

    // Atualiza abas de categoria
    updateCategoryTabs() {
        const categories = this.documentManager.getAllCategories();
        this.elements.documentTabsUl.innerHTML = '';

        // Adiciona aba 'Todos'
        const allTab = document.createElement('li');
        allTab.className = 'nav-item';
        allTab.innerHTML = `
            <a class="nav-link ${this.appStateManager.currentCategoryFilter === 'Todos' ? 'active' : ''}" href="#" data-category="Todos">
                <i class="bi bi-collection me-2"></i>Todos
            </a>
        `;
        this.elements.documentTabsUl.appendChild(allTab);

        // Adiciona abas de categoria
        categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `
                <a class="nav-link ${this.appStateManager.currentCategoryFilter === category ? 'active' : ''}" href="#" data-category="${category}">
                    <i class="bi bi-folder me-2"></i>${category}
                </a>
            `;
            this.elements.documentTabsUl.appendChild(li);
        });
    }

    // Destaca documento ativo
    highlightActiveDocument(id) {
        // Limpa destaques anteriores
        document.querySelectorAll('.nav-link.active-link').forEach(link => {
            link.classList.remove('active-link');
        });

        // Destaca o documento ativo
        if (id) {
            const activeLink = document.querySelector(`[data-document-id="${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active-link');
            }
        }
    }

    // Alterna visibilidade da sidebar
    toggleSidebar(isVisible, animated = true) {
        if (isVisible) {
            this.elements.sidebarElement.classList.remove('sidebar-hidden');
            this.elements.mainLayoutContainer.classList.remove('sidebar-hidden');
        } else {
            this.elements.sidebarElement.classList.add('sidebar-hidden');
            this.elements.mainLayoutContainer.classList.add('sidebar-hidden');
        }
        this.appStateManager.isSidebarVisible = isVisible;
    }

    // Função para mostrar modal de visualização JSON
    showJSONModal(docData, title = 'Visualizar JSON do Documento') {
        const jsonStr = JSON.stringify(docData, null, 2);
        Swal.fire({
            icon: 'info',
            title: title,
            html: `
                <div class="json-view-container">
                    <textarea class='form-control' id='json-display' style='height:300px;background:#181a1b;color:#e0e6eb;font-size:1rem;font-family:monospace;'>${escapeHtml(jsonStr)}</textarea>
                    <button class='json-copy-button' onclick='window.copyJsonToClipboard()'>
                        <i class='bi bi-clipboard'></i> Copiar JSON
                    </button>
                </div>
                <div class="json-tutorial-section">
                    <h6><i class="bi bi-info-circle me-2"></i>Como usar este JSON</h6>
                    <p>Este é o código JSON do seu documento. Você pode:</p>
                    <ol>
                        <li>Copiar este JSON para fazer backup</li>
                        <li>Compartilhar com outras pessoas</li>
                        <li>Importar em outro dispositivo</li>
                    </ol>
                    <p><strong>Para importar:</strong> Vá em "Importar Documento" na barra lateral, cole o JSON e clique em "Visualizar/Validar".</p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: 'Fechar',
            background: '#24282e',
            color: '#e0e6eb',
            width: '600px',
            customClass: {
                popup: 'json-popup'
            }
        });
    }
}
