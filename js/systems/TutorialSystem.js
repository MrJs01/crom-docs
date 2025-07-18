// --- Tutorial System ---
export class TutorialSystem {
    constructor() {
        this.panel = null;
        this.currentTutorial = 'general';
        this.minimizedSections = new Set();
        this.MINIMIZED_SECTIONS_KEY = 'tutorial_minimized_sections';
        this.loadMinimizedSections();
    }

    init() {
        this.panel = document.getElementById('tutorial-panel');
        
        if (!this.panel) {
            console.error('Tutorial Panel não encontrado! Verifique se o elemento #tutorial-panel existe no HTML.');
            return;
        }
        
        console.log('Tutorial System inicializado com sucesso');
        this.setupEventListeners();
        this.loadMinimizedSections();
    }

    setupEventListeners() {
        // Menu Tutorial (Desktop e Mobile)
        const menuTutorial = document.getElementById('menu-tutorial');
        const mobileMenuTutorial = document.getElementById('mobile-menu-tutorial');
        
        if (menuTutorial) {
            console.log('Event listener adicionado ao menu-tutorial');
            menuTutorial.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Menu tutorial clicado (desktop)');
                this.togglePanel();
            });
        } else {
            console.warn('Elemento #menu-tutorial não encontrado');
        }
        
        if (mobileMenuTutorial) {
            console.log('Event listener adicionado ao mobile-menu-tutorial');
            mobileMenuTutorial.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Menu tutorial clicado (mobile)');
                this.togglePanel();
                // Fechar dropdown mobile
                const mobileActionsDropdown = document.getElementById('mobile-actions-dropdown');
                if (mobileActionsDropdown) {
                    mobileActionsDropdown.classList.add('d-none');
                }
            });
        } else {
            console.warn('Elemento #mobile-menu-tutorial não encontrado');
        }

        // Fechar tutorial
        const closeBtn = document.getElementById('tutorial-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hidePanel();
            });
        }

        // Minimizar/expandir seções
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tutorial-minimize-btn') || 
                e.target.closest('.tutorial-minimize-btn')) {
                const btn = e.target.closest('.tutorial-minimize-btn');
                const target = btn.getAttribute('data-target');
                this.toggleSection(target);
            }
        });

        // Clique nos headers para minimizar/expandir
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tutorial-info-header')) {
                const header = e.target.closest('.tutorial-info-header');
                const btn = header.querySelector('.tutorial-minimize-btn');
                if (btn) {
                    const target = btn.getAttribute('data-target');
                    this.toggleSection(target);
                }
            }
        });

        // Tutorial Help Icons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tutorial-help-icon') || 
                e.target.closest('.tutorial-help-icon')) {
                e.preventDefault();
                const icon = e.target.closest('.tutorial-help-icon') || e.target;
                const tutorialType = icon.getAttribute('data-tutorial');
                if (tutorialType) {
                    this.showSpecificTutorial(tutorialType);
                }
            }
        });

        // Fechar ao clicar fora ou no overlay
        document.addEventListener('click', (e) => {
            if (this.panel && this.panel.classList.contains('active') && 
                !this.panel.contains(e.target) && 
                !e.target.closest('#menu-tutorial') &&
                !e.target.closest('#mobile-menu-tutorial') &&
                !e.target.classList.contains('tutorial-help-icon') &&
                !e.target.closest('.tutorial-help-icon')) {
                this.hidePanel();
            }
        });
    }

    togglePanel() {
        if (!this.panel) {
            console.error('Panel não existe, não é possível fazer toggle');
            return;
        }
        
        console.log('Toggle panel chamado. Estado atual:', this.panel.classList.contains('active'));
        
        if (this.panel.classList.contains('active')) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }

    showPanel(tutorialType = 'general') {
        if (!this.panel) {
            console.error('Panel não existe, não é possível exibir');
            return;
        }
        
        console.log('Exibindo tutorial panel, tipo:', tutorialType);
        this.panel.classList.add('active');
        this.showTutorial(tutorialType);
        
        // Adicionar overlay em mobile
        if (window.innerWidth <= 767.98) {
            this.createMobileOverlay();
        }
        
        console.log('Panel exibido. Classes:', this.panel.className);
    }

    hidePanel() {
        if (!this.panel) return;
        
        this.panel.classList.remove('active');
        
        // Remover overlay em mobile
        this.removeMobileOverlay();
    }
    
    createMobileOverlay() {
        let overlay = document.getElementById('tutorial-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'tutorial-overlay';
            overlay.className = 'tutorial-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                this.hidePanel();
            });
        }
        overlay.classList.add('active');
    }
    
    removeMobileOverlay() {
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    showTutorial(type, content = null) {
        this.currentTutorial = type;
        const generalSection = document.getElementById('tutorial-general');
        const specificSection = document.getElementById('tutorial-specific');
        
        if (type === 'general') {
            generalSection.classList.remove('d-none');
            specificSection.classList.add('d-none');
        } else {
            generalSection.classList.add('d-none');
            specificSection.classList.remove('d-none');
            
            if (content) {
                const specificContent = document.getElementById('tutorial-specific-content');
                specificContent.innerHTML = content;
            }
        }

        // Aplicar estados minimizados
        this.applyMinimizedStates();
    }

    toggleSection(sectionId) {
        const content = document.getElementById(sectionId);
        const btn = document.querySelector(`[data-target="${sectionId}"]`);
        
        if (content && btn) {
            const isMinimized = content.classList.contains('minimized');
            
            if (isMinimized) {
                content.classList.remove('minimized');
                btn.querySelector('i').className = 'bi bi-dash';
                this.minimizedSections.delete(sectionId);
            } else {
                content.classList.add('minimized');
                btn.querySelector('i').className = 'bi bi-plus';
                this.minimizedSections.add(sectionId);
            }
            
            this.saveMinimizedSections();
        }
    }

    loadMinimizedSections() {
        const saved = localStorage.getItem(this.MINIMIZED_SECTIONS_KEY);
        if (saved) {
            this.minimizedSections = new Set(JSON.parse(saved));
        }
    }

    saveMinimizedSections() {
        localStorage.setItem(this.MINIMIZED_SECTIONS_KEY, JSON.stringify([...this.minimizedSections]));
    }

    applyMinimizedStates() {
        this.minimizedSections.forEach(sectionId => {
            const content = document.getElementById(sectionId);
            const btn = document.querySelector(`[data-target="${sectionId}"]`);
            
            if (content && btn) {
                content.classList.add('minimized');
                btn.querySelector('i').className = 'bi bi-plus';
            }
        });
    }

    showSpecificTutorial(type, element = null) {
        const tutorials = {
            'document-properties': {
                title: 'Propriedades do Documento',
                content: `
                    <h6><i class="bi bi-file-earmark-text me-2"></i>Gerenciando Propriedades</h6>
                    <p>As propriedades do documento permitem organizar e identificar seus arquivos:</p>
                    <ul>
                        <li><strong>Nome:</strong> Título do documento que aparece na lista</li>
                        <li><strong>Categoria:</strong> Agrupa documentos similares (ex: "Projetos", "Pessoal")</li>
                        <li><strong>Etiquetas:</strong> Tags para busca rápida (separadas por vírgula)</li>
                    </ul>
                    <p><strong>Dica:</strong> Use categorias consistentes para melhor organização.</p>
                `
            },
            'document-export': {
                title: 'Exportar Documento',
                content: `
                    <h6><i class="bi bi-download me-2"></i>Exportando Documentos</h6>
                    <p>Sistema completo de exportação com múltiplos formatos:</p>
                    <ul>
                        <li><strong>PDF:</strong> Formato ideal para impressão e compartilhamento</li>
                        <li><strong>Word:</strong> Documento editável no Microsoft Word</li>
                        <li><strong>HTML:</strong> Página web com formatação preservada</li>
                        <li><strong>TXT:</strong> Texto puro sem formatação</li>
                        <li><strong>Markdown:</strong> Formato para desenvolvedores</li>
                    </ul>
                    
                    <h6><i class="bi bi-eye me-2"></i>Preview em Tempo Real</h6>
                    <p>Veja como ficará o documento antes de exportar:</p>
                    <ul>
                        <li>Preview atualiza automaticamente</li>
                        <li>Controles de zoom para melhor visualização</li>
                        <li>Configurações específicas por formato</li>
                    </ul>
                    
                    <h6><i class="bi bi-envelope me-2"></i>Envio por Email</h6>
                    <p>Compartilhe documentos diretamente:</p>
                    <ul>
                        <li>Envie o documento como anexo</li>
                        <li>Adicione mensagem personalizada</li>
                        <li>Suporte a múltiplos formatos</li>
                    </ul>
                    
                    <h6><i class="bi bi-share me-2"></i>Compartilhamento Público</h6>
                    <p><em>Em breve:</em> Crie links seguros para compartilhar documentos publicamente.</p>
                    
                    <p><strong>Dica:</strong> Use HTML para preservar toda a formatação, ou PDF para documentos finais.</p>
                `
            },
            'document-import': {
                title: 'Importar Documento',
                content: `
                    <h6><i class="bi bi-upload me-2"></i>Importando Documentos</h6>
                    <p>Para importar um documento JSON:</p>
                    <ol>
                        <li>Copie o código JSON do documento</li>
                        <li>Cole na área de texto</li>
                        <li>Clique em "Visualizar/Validar"</li>
                        <li>Confirme a importação</li>
                    </ol>
                    <p><strong>Dica:</strong> Você pode editar o JSON antes de importar.</p>
                    
                    <h6><i class="bi bi-file-earmark-arrow-up me-2"></i>Importando de Arquivos</h6>
                    <p>Suporte para múltiplos formatos de arquivo:</p>
                    <ul>
                        <li><strong>PDF:</strong> Extrai texto de documentos PDF</li>
                        <li><strong>Word:</strong> Arquivos .doc e .docx</li>
                        <li><strong>HTML:</strong> Páginas web e arquivos HTML</li>
                        <li><strong>Texto:</strong> Arquivos .txt simples</li>
                        <li><strong>Markdown:</strong> Arquivos .md com formatação</li>
                        <li><strong>RTF:</strong> Rich Text Format</li>
                    </ul>
                    <p><strong>Dica:</strong> Arraste e solte arquivos diretamente na área de importação.</p>
                `
            },
            'editor-toolbar': {
                title: 'Barra de Ferramentas',
                content: `
                    <h6><i class="bi bi-tools me-2"></i>Ferramentas de Edição</h6>
                    <p>A barra de ferramentas oferece formatação rápida:</p>
                    <ul>
                        <li><strong>Formatação:</strong> Negrito, itálico, sublinhado, tachado</li>
                        <li><strong>Títulos:</strong> Selecione o tipo de título no dropdown</li>
                        <li><strong>Listas:</strong> Crie listas com marcadores ou números</li>
                        <li><strong>Alinhamento:</strong> Esquerda, centro, direita, justificado</li>
                        <li><strong>Links:</strong> Adicione ou remova links</li>
                    </ul>
                    <p><strong>Dica:</strong> Use atalhos de teclado para formatação mais rápida.</p>
                `
            },
            'dashboard': {
                title: 'Dashboard',
                content: `
                    <h6><i class="bi bi-grid-3x3-gap me-2"></i>Visão Geral dos Documentos</h6>
                    <p>O dashboard oferece uma visão completa dos seus documentos:</p>
                    <ul>
                        <li><strong>Categorias:</strong> Filtre por categoria nas abas superiores</li>
                        <li><strong>Busca:</strong> Procure por nome, categoria ou etiquetas</li>
                        <li><strong>Ordenação:</strong> Organize por data, nome ou outros critérios</li>
                        <li><strong>Cartões:</strong> Visualize informações resumidas</li>
                    </ul>
                    <p><strong>Dica:</strong> Clique com o botão direito nos documentos para mais opções.</p>
                `
            }
        };

        const tutorial = tutorials[type];
        if (tutorial) {
            // Garantir que o painel seja exibido
            this.showPanel('specific');
            
            const specificContent = document.getElementById('tutorial-specific-content');
            if (specificContent) {
                specificContent.innerHTML = tutorial.content;
            }
            
            // Atualiza o título da seção específica
            const specificTitle = document.querySelector('#tutorial-specific h5');
            if (specificTitle) {
                specificTitle.textContent = tutorial.title;
            }
            
            // Scroll para o topo do painel
            if (this.panel) {
                this.panel.scrollTop = 0;
            }
        } else {
            console.warn(`Tutorial tipo '${type}' não encontrado`);
        }
    }
}
