import { escapeHtml } from '../utils/escapeHtml.js';
import { JSONCopySystem } from '../systems/JSONCopySystem.js';
import FileImportManager from './FileImportManager.js';
import { formatFileSize, getFileIcon, createFilePreview } from '../utils/fileUtils.js';

// Classe para gerenciar funcionalidades de importação
export class ImportManager {
    constructor(documentManager, uiManager) {
        this.documentManager = documentManager;
        this.uiManager = uiManager;
        this.fileImportManager = new FileImportManager();
        this.currentFile = null;
        this.processedContent = null;
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.elements = {
            // Elementos existentes
            importDocumentLink: document.getElementById('import-document-link'),
            importDocumentView: document.getElementById('import-document-view'),
            importJsonTextarea: document.getElementById('import-json-textarea'),
            validateImportJsonBtn: document.getElementById('validate-import-json-btn'),
            importJsonPreview: document.getElementById('import-json-preview'),
            confirmImportJsonBtn: document.getElementById('confirm-import-json-btn'),
            
            // Novos elementos para importação de arquivos
            fileDropArea: document.getElementById('file-drop-area'),
            selectFileBtn: document.getElementById('select-file-btn'),
            fileImportInput: document.getElementById('file-import-input'),
            fileInfo: document.getElementById('file-info'),
            filePreview: document.getElementById('file-preview'),
            fileStats: document.getElementById('file-stats'),
            processingOptions: document.getElementById('processing-options'),
            processingStatus: document.getElementById('processing-status'),
            processFileBtn: document.getElementById('process-file-btn'),
            confirmFileImportBtn: document.getElementById('confirm-file-import-btn'),
            
            // Views
            dashboardView: document.getElementById('dashboard-view'),
            editorView: document.getElementById('editor-view'),
            settingsView: document.getElementById('settings-view')
        };
    }

    setupEventListeners() {
        // Event listeners existentes
        if (this.elements.importDocumentLink) {
            this.elements.importDocumentLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showImportDocumentView();
            });
        }

        if (this.elements.validateImportJsonBtn) {
            this.elements.validateImportJsonBtn.addEventListener('click', () => {
                this.validateImportJson();
            });
        }

        if (this.elements.confirmImportJsonBtn) {
            this.elements.confirmImportJsonBtn.addEventListener('click', () => {
                this.confirmImportJson();
            });
        }

        // Novos event listeners para importação de arquivos
        this.setupFileImportListeners();
    }

    setupFileImportListeners() {
        console.log('Configurando listeners de importação de arquivo...');
        
        // Drag and drop
        if (this.elements.fileDropArea) {
            console.log('FileDropArea encontrado, configurando drag & drop');
            this.elements.fileDropArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.elements.fileDropArea.classList.add('drag-over');
            });

            this.elements.fileDropArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.elements.fileDropArea.classList.remove('drag-over');
            });

            this.elements.fileDropArea.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.elements.fileDropArea.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    console.log('Arquivo solto:', files[0].name);
                    this.handleFileSelection(files[0]);
                }
            });

            this.elements.fileDropArea.addEventListener('click', () => {
                console.log('Área de drop clicada');
                this.elements.fileImportInput.click();
            });
        } else {
            console.error('FileDropArea não encontrado!');
        }

        // File input
        if (this.elements.fileImportInput) {
            console.log('FileImportInput encontrado');
            this.elements.fileImportInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    console.log('Arquivo selecionado via input:', e.target.files[0].name);
                    this.handleFileSelection(e.target.files[0]);
                }
            });
        } else {
            console.error('FileImportInput não encontrado!');
        }

        // Select file button
        if (this.elements.selectFileBtn) {
            console.log('SelectFileBtn encontrado');
            this.elements.selectFileBtn.addEventListener('click', () => {
                console.log('Botão selecionar arquivo clicado');
                this.elements.fileImportInput.click();
            });
        } else {
            console.error('SelectFileBtn não encontrado!');
        }

        // Process file button
        if (this.elements.processFileBtn) {
            console.log('ProcessFileBtn encontrado');
            this.elements.processFileBtn.addEventListener('click', () => {
                console.log('Botão processar arquivo clicado');
                this.processFile();
            });
        } else {
            console.error('ProcessFileBtn não encontrado!');
        }

        // Confirm import button
        if (this.elements.confirmFileImportBtn) {
            console.log('ConfirmFileImportBtn encontrado');
            this.elements.confirmFileImportBtn.addEventListener('click', () => {
                console.log('Botão confirmar importação clicado');
                this.confirmFileImport();
            });
        } else {
            console.error('ConfirmFileImportBtn não encontrado!');
        }
    }

    showImportDocumentView() {
        // Usa o método showView do UIManager
        this.uiManager.showView('import');
        
        // Limpa formulário
        this.elements.importJsonTextarea.value = '';
        this.elements.importJsonPreview.classList.add('d-none');
        this.elements.importJsonPreview.textContent = '';
        this.elements.confirmImportJsonBtn.disabled = true;
    }

    validateImportJson() {
        const jsonStr = this.elements.importJsonTextarea.value.trim();
        
        if (!jsonStr) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vazio',
                text: 'Cole ou edite o JSON do documento antes de validar.',
                background: '#24282e',
                color: '#e0e6eb'
            });
            this.elements.importJsonPreview.classList.add('d-none');
            this.elements.confirmImportJsonBtn.disabled = true;
            return;
        }

        try {
            const docData = JSON.parse(jsonStr);
            this.elements.importJsonPreview.textContent = JSON.stringify(docData, null, 2);
            this.elements.importJsonPreview.classList.remove('d-none');
            this.elements.confirmImportJsonBtn.disabled = false;
        } catch (e) {
            this.elements.importJsonPreview.textContent = 'JSON inválido: ' + e.message;
            this.elements.importJsonPreview.classList.remove('d-none');
            this.elements.confirmImportJsonBtn.disabled = true;
        }
    }

    confirmImportJson() {
        const jsonStr = this.elements.importJsonTextarea.value.trim();
        if (!jsonStr) return;

        try {
            let docData = JSON.parse(jsonStr);
            docData.id = `doc-imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            this.documentManager.importDocument(docData);
            
            Swal.fire({
                icon: 'success',
                title: 'Documento importado!',
                text: 'O documento foi importado com sucesso.',
                background: '#24282e',
                color: '#e0e6eb'
            });
            
            // Atualiza interface
            this.uiManager.updateDocumentList();
            this.uiManager.renderDocumentCards();
            this.uiManager.updateCategoryTabs();
            this.uiManager.updateDashboardStats(); // Atualiza estatísticas após importar documento
            
            // Volta para dashboard
            this.uiManager.showView('dashboard');
            
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao importar',
                text: e.message,
                background: '#24282e',
                color: '#e0e6eb'
            });
        }
    }

    async handleFileSelection(file) {
        console.log('Arquivo selecionado:', file.name, 'Tipo:', file.type, 'Tamanho:', file.size);
        this.currentFile = file;
        
        // Valida arquivo
        console.log('Validando arquivo...');
        const validation = this.fileImportManager.validateFile(file);
        console.log('Resultado da validação:', validation);
        
        if (!validation.valid) {
            console.error('Arquivo inválido:', validation.errors);
            this.showError(validation.errors.join(', '));
            return;
        }

        // Mostra informações do arquivo
        console.log('Exibindo informações do arquivo...');
        this.displayFileInfo(file);
        
        // Gera preview
        try {
            console.log('Gerando preview...');
            await this.generateFilePreview(file);
            console.log('Preview gerado com sucesso');
        } catch (error) {
            console.error('Erro ao gerar preview:', error);
            this.showError('Erro ao gerar preview do arquivo');
        }
    }

    displayFileInfo(file) {
        console.log('Exibindo informações do arquivo:', file.name);
        
        const fileInfo = this.elements.fileInfo;
        if (!fileInfo) {
            console.error('Elemento fileInfo não encontrado!');
            return;
        }
        
        const fileIcon = fileInfo.querySelector('.file-icon');
        const fileName = fileInfo.querySelector('.file-name');
        const fileDetails = fileInfo.querySelector('.file-details');
        
        if (!fileIcon || !fileName || !fileDetails) {
            console.error('Subelementos de fileInfo não encontrados!');
            console.error('fileIcon:', fileIcon, 'fileName:', fileName, 'fileDetails:', fileDetails);
            return;
        }
        
        fileIcon.className = `file-icon ${getFileIcon(file)} me-2`;
        fileName.textContent = file.name;
        fileDetails.textContent = `${formatFileSize(file.size)} • ${file.type || 'Tipo desconhecido'}`;
        
        fileInfo.classList.remove('d-none');
        
        if (this.elements.processingOptions) {
            this.elements.processingOptions.classList.remove('d-none');
        }
        
        if (this.elements.processFileBtn) {
            console.log('Habilitando botão processar arquivo');
            this.elements.processFileBtn.disabled = false;
        } else {
            console.error('Botão processar arquivo não encontrado!');
        }
    }

    async generateFilePreview(file) {
        try {
            const preview = await createFilePreview(file);
            const previewContainer = this.elements.filePreview;
            
            // Limpa preview anterior
            previewContainer.innerHTML = '';
            
            if (preview.type === 'text') {
                previewContainer.innerHTML = `
                    <div class="text-preview">
                        <h6 class="text-light mb-2">Preview do Texto:</h6>
                        <pre class="text-muted">${escapeHtml(preview.data)}</pre>
                    </div>
                `;
                
                // Mostra estatísticas
                this.displayFileStats({
                    characters: preview.length,
                    words: preview.data.split(/\s+/).filter(w => w.length > 0).length,
                    lines: preview.data.split('\n').length
                });
                
            } else if (preview.type === 'html') {
                previewContainer.innerHTML = `
                    <div class="html-preview">
                        <h6 class="text-light mb-2">Preview HTML (Renderizado):</h6>
                        <div class="html-preview-content p-3 mb-3 bg-light rounded" style="max-height: 300px; overflow-y: auto;">
                            ${preview.preview}
                        </div>
                        <details class="mt-2">
                            <summary class="text-muted small">Ver código HTML</summary>
                            <pre class="text-muted small mt-2" style="max-height: 200px; overflow-y: auto;">${escapeHtml(preview.data.substring(0, 1000) + (preview.data.length > 1000 ? '...' : ''))}</pre>
                        </details>
                    </div>
                `;
                
                // Mostra estatísticas
                this.displayFileStats({
                    characters: preview.length,
                    words: preview.data.split(/\s+/).filter(w => w.length > 0).length,
                    lines: preview.data.split('\n').length
                });
                
            } else if (preview.type === 'image') {
                previewContainer.innerHTML = `
                    <div class="image-preview text-center">
                        <h6 class="text-light mb-2">Preview da Imagem:</h6>
                        <img src="${preview.data}" alt="Preview" class="img-fluid rounded" style="max-width: 200px;">
                    </div>
                `;
                
            } else {
                previewContainer.innerHTML = `
                    <div class="file-preview-generic text-center">
                        <i class="${preview.icon} display-1 text-secondary mb-2"></i>
                        <h6 class="text-light">${preview.name}</h6>
                        <p class="text-muted">${preview.size}</p>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Erro ao gerar preview:', error);
            this.elements.filePreview.innerHTML = `
                <div class="preview-error text-center py-4">
                    <i class="bi bi-exclamation-triangle text-warning display-1"></i>
                    <p class="text-muted">Erro ao gerar preview</p>
                </div>
            `;
        }
    }

    displayFileStats(stats) {
        const statsContainer = this.elements.fileStats;
        
        statsContainer.querySelector('.stats-characters').textContent = stats.characters || 0;
        statsContainer.querySelector('.stats-words').textContent = stats.words || 0;
        statsContainer.querySelector('.stats-lines').textContent = stats.lines || 0;
        
        statsContainer.classList.remove('d-none');
    }

    async processFile() {
        if (!this.currentFile) {
            this.showError('Nenhum arquivo selecionado');
            return;
        }

        // Mostra status de processamento
        this.elements.processingStatus.classList.remove('d-none');
        this.elements.processFileBtn.disabled = true;
        
        try {
            // Obtém opções de processamento
            const options = this.getProcessingOptions();
            
            // Processa arquivo
            const result = await this.fileImportManager.processFile(this.currentFile, options);
            
            if (result.success) {
                this.processedContent = result;
                this.displayProcessedContent(result);
                this.elements.confirmFileImportBtn.disabled = false;
                this.showSuccess('Arquivo processado com sucesso!');
            } else {
                this.showError(result.error || 'Erro ao processar arquivo');
            }
            
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            this.showError('Erro interno ao processar arquivo');
        } finally {
            this.elements.processingStatus.classList.add('d-none');
            this.elements.processFileBtn.disabled = false;
        }
    }

    getProcessingOptions() {
        return {
            preserveFormatting: document.getElementById('preserve-formatting').checked,
            extractImages: document.getElementById('extract-images').checked,
            processLinks: document.getElementById('process-links').checked
        };
    }

    displayProcessedContent(result) {
        const previewContainer = this.elements.filePreview;
        
        previewContainer.innerHTML = `
            <div class="processed-content">
                <h6 class="text-light mb-2">Conteúdo Processado:</h6>
                <div class="content-preview border rounded p-3" style="max-height: 300px; overflow-y: auto;">
                    ${result.content}
                </div>
            </div>
        `;
        
        // Atualiza estatísticas
        if (result.metadata) {
            this.displayFileStats({
                characters: result.metadata.characters || 0,
                words: result.metadata.words || 0,
                lines: result.metadata.paragraphs || 0
            });
        }
    }

    async confirmFileImport() {
        if (!this.processedContent) {
            this.showError('Nenhum conteúdo processado para importar');
            return;
        }

        try {
            console.log('Importando documento com conteúdo processado:', this.processedContent);
            
            // Cria documento com o conteúdo processado
            const documentData = {
                title: this.processedContent.title || 'Documento Importado',
                content: this.processedContent.content,
                category: 'Importados',
                tags: ['importado', this.processedContent.metadata?.originalFormat || 'arquivo'],
                metadata: {
                    ...this.processedContent.metadata,
                    importedFrom: this.currentFile.name,
                    importedAt: new Date().toISOString()
                }
            };

            console.log('Dados do documento a ser salvo:', documentData);
            
            const savedDocument = await this.documentManager.saveDocument(documentData);
            
            if (savedDocument) {
                console.log('Documento salvo com sucesso:', savedDocument);
                this.showSuccess('Documento importado com sucesso!');
                
                // Atualiza a lista de documentos
                if (this.uiManager && this.uiManager.updateDocumentList) {
                    this.uiManager.updateDocumentList();
                }
                
                // Aguarda um pouco para mostrar mensagem de sucesso
                setTimeout(() => {
                    // Redireciona para o editor e carrega o documento
                    this.uiManager.showView('editor');
                    
                    // Usa o EventManager para carregar o documento se disponível
                    if (window.eventManager && window.eventManager.loadAndDisplayDocument) {
                        console.log('Carregando documento via EventManager');
                        window.eventManager.loadAndDisplayDocument(savedDocument.id);
                    } else {
                        console.log('EventManager não disponível, usando DocumentManager diretamente');
                        this.documentManager.loadDocument(savedDocument.id);
                    }
                }, 1500);
            } else {
                this.showError('Erro ao salvar documento importado');
            }
            
        } catch (error) {
            console.error('Erro ao importar documento:', error);
            this.showError('Erro interno ao importar documento');
        }
    }

    showError(message) {
        // Remove mensagens anteriores
        this.clearMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'import-error';
        errorDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Erro:</strong> ${message}
        `;
        
        this.elements.filePreview.appendChild(errorDiv);
    }

    showSuccess(message) {
        // Remove mensagens anteriores
        this.clearMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'import-success';
        successDiv.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            <strong>Sucesso:</strong> ${message}
        `;
        
        this.elements.filePreview.appendChild(successDiv);
    }

    clearMessages() {
        const messages = this.elements.filePreview.querySelectorAll('.import-error, .import-success, .import-warning');
        messages.forEach(msg => msg.remove());
    }

    showImportDocumentView() {
        // Usa o método showView do UIManager
        this.uiManager.showView('import');
        
        // Reset do estado
        this.currentFile = null;
        this.processedContent = null;
        
        // Limpa formulários
        if (this.elements.fileImportInput) {
            this.elements.fileImportInput.value = '';
        }
        if (this.elements.importJsonTextarea) {
            this.elements.importJsonTextarea.value = '';
        }
        
        // Reset da interface
        if (this.elements.fileInfo) {
            this.elements.fileInfo.classList.add('d-none');
        }
        if (this.elements.processingOptions) {
            this.elements.processingOptions.classList.add('d-none');
        }
        if (this.elements.fileStats) {
            this.elements.fileStats.classList.add('d-none');
        }
        if (this.elements.processFileBtn) {
            this.elements.processFileBtn.disabled = true;
        }
        if (this.elements.confirmFileImportBtn) {
            this.elements.confirmFileImportBtn.disabled = true;
        }
        
        // Reset do preview
        if (this.elements.filePreview) {
            this.elements.filePreview.innerHTML = `
                <div class="preview-placeholder text-center py-5">
                    <i class="bi bi-eye display-1 text-secondary"></i>
                    <p class="text-muted">Selecione um arquivo para visualizar o preview</p>
                </div>
            `;
        }
    }
}
