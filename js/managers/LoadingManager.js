// Sistema de Loading
export class LoadingManager {
    constructor() {
        this.loadingElement = null;
        this.isLoading = false;
        this.loadingQueue = new Set();
        this.init();
    }

    init() {
        this.createLoadingElement();
    }

    createLoadingElement() {
        // Remove elemento existente se houver
        const existing = document.getElementById('global-loading');
        if (existing) existing.remove();

        // Cria novo elemento de loading
        this.loadingElement = document.createElement('div');
        this.loadingElement.id = 'global-loading';
        this.loadingElement.className = 'loading-overlay d-none';
        
        this.loadingElement.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                </div>
                <div class="loading-text">
                    <h5 class="mb-2">Carregando...</h5>
                    <p class="mb-0 text-muted" id="loading-message">Preparando o aplicativo</p>
                </div>
                <div class="loading-progress">
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" 
                             role="progressbar" 
                             style="width: 0%" 
                             id="loading-progress-bar">
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.loadingElement);
    }

    // Mostra loading com mensagem personalizada
    show(message = 'Carregando...', taskId = null) {
        const messageEl = document.getElementById('loading-message');
        if (messageEl) messageEl.textContent = message;

        if (taskId) {
            this.loadingQueue.add(taskId);
        }

        if (!this.isLoading) {
            this.isLoading = true;
            this.loadingElement.classList.remove('d-none');
            document.body.classList.add('loading-active');
        }
    }

    // Esconde loading
    hide(taskId = null) {
        if (taskId) {
            this.loadingQueue.delete(taskId);
            
            // Só esconde se não há outras tarefas pendentes
            if (this.loadingQueue.size > 0) {
                return;
            }
        }

        this.isLoading = false;
        this.loadingElement.classList.add('d-none');
        document.body.classList.remove('loading-active');
        this.resetProgress();
    }

    // Atualiza progresso (0-100)
    updateProgress(percentage, message = null) {
        const progressBar = document.getElementById('loading-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (message) {
            const messageEl = document.getElementById('loading-message');
            if (messageEl) messageEl.textContent = message;
        }
    }

    // Reseta progresso
    resetProgress() {
        const progressBar = document.getElementById('loading-progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }

    // Loading específico para operações de documento
    showDocumentLoading(operation = 'documento') {
        this.show(`Carregando ${operation}...`, 'document-operation');
    }

    hideDocumentLoading() {
        this.hide('document-operation');
    }

    // Loading para inicialização da aplicação
    showAppLoading() {
        this.show('Inicializando aplicação...', 'app-init');
        this.updateProgress(10, 'Carregando módulos...');
        
        setTimeout(() => {
            this.updateProgress(30, 'Inicializando gerenciadores...');
        }, 200);
        
        setTimeout(() => {
            this.updateProgress(60, 'Carregando documentos...');
        }, 400);
        
        setTimeout(() => {
            this.updateProgress(90, 'Finalizando...');
        }, 600);
    }

    hideAppLoading() {
        this.updateProgress(100, 'Pronto!');
        setTimeout(() => {
            this.hide('app-init');
        }, 300);
    }

    // Simula loading para operações assíncronas
    async simulateAsyncOperation(operation, duration = 1000) {
        const taskId = `async-${Date.now()}`;
        this.show(`${operation}...`, taskId);
        
        // Simula progresso
        const steps = 10;
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
            const percentage = (i / steps) * 100;
            this.updateProgress(percentage, `${operation}... ${Math.round(percentage)}%`);
            
            if (i < steps) {
                await new Promise(resolve => setTimeout(resolve, stepDuration));
            }
        }
        
        this.hide(taskId);
    }
}
