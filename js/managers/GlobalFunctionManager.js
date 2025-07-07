import { escapeHtml } from '../utils/escapeHtml.js';
import { JSONCopySystem } from '../systems/JSONCopySystem.js';

// Gerenciador de funções globais da aplicação
export class GlobalFunctionManager {
    constructor(documentManager, uiManager) {
        this.documentManager = documentManager;
        this.uiManager = uiManager;
        this.setupGlobalFunctions();
    }

    setupGlobalFunctions() {
        // Função global para copiar JSON
        window.copyJsonToClipboard = () => {
            const jsonDisplay = document.getElementById('json-display');
            if (jsonDisplay) {
                JSONCopySystem.copyToClipboard(jsonDisplay.value);
            }
        };

        // Função global para copiar JSON do contexto
        window.copyContextJsonToClipboard = () => {
            const jsonDisplay = document.getElementById('json-display-context');
            if (jsonDisplay) {
                JSONCopySystem.copyToClipboard(jsonDisplay.value);
            }
        };

        // Função global para editar propriedades do documento
        window.editDocumentProperties = (documentId) => {
            const doc = this.documentManager.loadDocument(documentId);
            if (!doc) return;

            const modal = new bootstrap.Modal(document.getElementById('document-properties-modal'));
            document.getElementById('edit-doc-id').value = documentId;
            document.getElementById('document-name-input').value = doc.name;
            document.getElementById('document-category-input').value = doc.category || '';
            document.getElementById('document-tags-input').value = doc.tags.join(', ');
            modal.show();
        };

        // Função global para exportar documento único
        window.exportSingleDocument = (documentId) => {
            const doc = this.documentManager.loadDocument(documentId);
            if (!doc) return;

            const dataStr = JSON.stringify(doc, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = `${doc.name}_${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        };

        // Função global para visualizar JSON do documento
        window.viewDocumentJSON = (documentId) => {
            const doc = this.documentManager.loadDocument(documentId);
            if (!doc) return;

            const jsonStr = JSON.stringify(doc, null, 2);
            Swal.fire({
                icon: 'info',
                title: 'JSON do Documento',
                html: `
                    <div class="json-view-container">
                        <textarea class='form-control' id='json-display-context' style='height:300px;background:#181a1b;color:#e0e6eb;font-size:1rem;font-family:monospace;'>${escapeHtml(jsonStr)}</textarea>
                        <button class='json-copy-button' onclick='copyContextJsonToClipboard()'>
                            <i class='bi bi-clipboard'></i> Copiar JSON
                        </button>
                    </div>
                    <div class="json-tutorial-section">
                        <h6><i class="bi bi-info-circle me-2"></i>Como usar este JSON</h6>
                        <p>Este é o código JSON do documento "${doc.name}".</p>
                        <p><strong>Para importar:</strong> Copie este JSON, vá em "Importar Documento" na barra lateral, cole e clique em "Visualizar/Validar".</p>
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
        };

        // Função global para excluir documento
        window.deleteDocument = (documentId) => {
            const doc = this.documentManager.loadDocument(documentId);
            if (!doc) return;

            Swal.fire({
                title: 'Tem certeza?',
                text: `Você está prestes a excluir o documento "${doc.name}". Esta ação não pode ser desfeita.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sim, excluir',
                cancelButtonText: 'Cancelar',
                background: '#24282e',
                color: '#e0e6eb'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.documentManager.deleteDocument(documentId);
                    this.uiManager.updateDocumentList();
                    this.uiManager.updateCategoryTabs();
                    this.uiManager.renderDocumentCards();
                    this.uiManager.updateDashboardStats(); // Atualiza estatísticas após excluir documento
                    
                    // Se o documento excluído estava aberto, limpar editor
                    if (window.appStateManager && window.appStateManager.currentDocumentId === documentId) {
                        window.appStateManager.currentDocumentId = null;
                        if (window.editor) window.editor.setContent('');
                        this.uiManager.highlightActiveDocument(null);
                        this.uiManager.showView('dashboard');
                    }
                    
                    Swal.fire({
                        title: 'Excluído!',
                        text: 'O documento foi excluído com sucesso.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#24282e',
                        color: '#e0e6eb'
                    });
                }
            });
        };
    }
}
