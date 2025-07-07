/**
 * ExportManager - Gerencia as funcionalidades de exportação de documentos
 */

import { exportUtils } from '../utils/exportUtils.js';

class ExportManager {
    constructor() {
        console.log('ExportManager: Constructor called');
        this.currentDocument = null;
        this.currentFormat = 'pdf';
        this.currentZoom = 100;
        this.exportConfig = {
            pdf: {
                pageSize: 'a4',
                orientation: 'portrait',
                includeMetadata: true,
                theme: 'dark',
                customColor: '#1C1F23'
            },
            docx: {
                fontSize: 12,
                includeToc: false
            },
            html: {
                theme: 'dark',
                customColor: '#1C1F23',
                includeStyles: true
            }
        };
        
        this.initializeExportView();
        this.setupEventListeners();
        console.log('ExportManager: Initialization complete');
    }

    initializeExportView() {
        // Inicializar elementos da view de exportação
        this.exportFormatSelect = document.getElementById('export-format-select');
        this.exportPreviewContent = document.getElementById('export-preview-content');
        this.exportDocumentBtn = document.getElementById('export-document-btn');
        this.exportEmailBtn = document.getElementById('export-email-btn');
        this.exportEmailInput = document.getElementById('export-email-input');
        this.exportEmailMessage = document.getElementById('export-email-message');
        
        // Controles de zoom
        this.previewZoomOut = document.getElementById('preview-zoom-out');
        this.previewZoomIn = document.getElementById('preview-zoom-in');
        this.previewZoomReset = document.getElementById('preview-zoom-reset');
        
        console.log('ExportManager: Elements initialized:', {
            exportFormatSelect: !!this.exportFormatSelect,
            exportPreviewContent: !!this.exportPreviewContent,
            exportDocumentBtn: !!this.exportDocumentBtn,
            exportEmailBtn: !!this.exportEmailBtn
        });
        
        // Configurações específicas
        this.setupFormatConfigs();
        
        // Inicializar valores padrão dos selects
        this.initializeDefaultValues();
    }

    initializeDefaultValues() {
        // Definir valores padrão para os temas
        const pdfTheme = document.getElementById('pdf-theme');
        const htmlTheme = document.getElementById('html-theme');
        const pdfCustomColor = document.getElementById('pdf-custom-color');
        const pdfCustomColorText = document.getElementById('pdf-custom-color-text');
        const htmlCustomColor = document.getElementById('html-custom-color');
        const htmlCustomColorText = document.getElementById('html-custom-color-text');
        
        // Definir tema dark por padrão
        if (pdfTheme) {
            pdfTheme.value = this.exportConfig.pdf.theme;
        }
        if (htmlTheme) {
            htmlTheme.value = this.exportConfig.html.theme;
        }
        
        // Definir cor padrão (CROM dark)
        if (pdfCustomColor) {
            pdfCustomColor.value = this.exportConfig.pdf.customColor;
        }
        if (pdfCustomColorText) {
            pdfCustomColorText.value = this.exportConfig.pdf.customColor;
        }
        if (htmlCustomColor) {
            htmlCustomColor.value = this.exportConfig.html.customColor;
        }
        if (htmlCustomColorText) {
            htmlCustomColorText.value = this.exportConfig.html.customColor;
        }
        
        // Atualizar configuração inicial
        this.updateFormatConfig();
    }

    setupEventListeners() {
        // Mudança de formato
        this.exportFormatSelect?.addEventListener('change', (e) => {
            this.currentFormat = e.target.value;
            this.updateFormatConfig();
            this.generatePreview();
        });

        // Botão de exportação
        this.exportDocumentBtn?.addEventListener('click', () => {
            this.exportDocument();
        });

        // Botão de envio por email
        this.exportEmailBtn?.addEventListener('click', () => {
            this.sendDocumentByEmail();
        });

        // Controles de zoom
        this.previewZoomOut?.addEventListener('click', () => {
            this.adjustZoom(-10);
        });

        this.previewZoomIn?.addEventListener('click', () => {
            this.adjustZoom(10);
        });

        this.previewZoomReset?.addEventListener('click', () => {
            this.resetZoom();
        });

        // Configurações específicas
        this.setupFormatEventListeners();
        
        // Adicionar métodos de debug para o console
        window.debugExport = () => {
            if (window.exportManager) {
                window.exportManager.debugState();
            } else {
                console.error('ExportManager não encontrado');
            }
        };
        
        window.testExport = () => {
            if (window.exportManager) {
                const testDoc = {
                    id: 'test-doc',
                    name: 'Documento de Teste',
                    content: '<h1>Teste de Exportação</h1><p>Este é um documento de teste para verificar a funcionalidade de exportação.</p>',
                    metadata: {
                        title: 'Documento de Teste',
                        lastModified: Date.now()
                    }
                };
                
                window.exportManager.setCurrentDocument(testDoc);
                window.exportManager.exportDocument();
            } else {
                console.error('ExportManager não encontrado');
            }
        };
        
        console.log('ExportManager: Debug methods added to window: debugExport(), testExport()');
    }

    setupFormatConfigs() {
        // PDF Config
        const pdfPageSize = document.getElementById('pdf-page-size');
        const pdfOrientation = document.getElementById('pdf-orientation');
        const pdfIncludeMetadata = document.getElementById('pdf-include-metadata');
        const pdfTheme = document.getElementById('pdf-theme');
        const pdfCustomColor = document.getElementById('pdf-custom-color');
        const pdfCustomColorText = document.getElementById('pdf-custom-color-text');
        const pdfCustomColorContainer = document.getElementById('pdf-custom-color-container');

        pdfPageSize?.addEventListener('change', (e) => {
            this.exportConfig.pdf.pageSize = e.target.value;
            this.generatePreview();
        });

        pdfOrientation?.addEventListener('change', (e) => {
            this.exportConfig.pdf.orientation = e.target.value;
            this.generatePreview();
        });

        pdfIncludeMetadata?.addEventListener('change', (e) => {
            this.exportConfig.pdf.includeMetadata = e.target.checked;
        });

        pdfTheme?.addEventListener('change', (e) => {
            this.exportConfig.pdf.theme = e.target.value;
            if (e.target.value === 'custom') {
                pdfCustomColorContainer?.classList.remove('d-none');
            } else {
                pdfCustomColorContainer?.classList.add('d-none');
                if (e.target.value === 'dark') {
                    this.exportConfig.pdf.customColor = '#1C1F23';
                } else {
                    this.exportConfig.pdf.customColor = '#ffffff';
                }
            }
            this.generatePreview();
        });

        // Sincronizar color picker com text input
        pdfCustomColor?.addEventListener('change', (e) => {
            this.exportConfig.pdf.customColor = e.target.value;
            if (pdfCustomColorText) pdfCustomColorText.value = e.target.value;
            this.generatePreview();
        });

        pdfCustomColorText?.addEventListener('change', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                this.exportConfig.pdf.customColor = color;
                if (pdfCustomColor) pdfCustomColor.value = color;
                this.generatePreview();
            }
        });

        // DOCX Config
        const docxFontSize = document.getElementById('docx-font-size');
        const docxIncludeToc = document.getElementById('docx-include-toc');

        docxFontSize?.addEventListener('change', (e) => {
            this.exportConfig.docx.fontSize = parseInt(e.target.value);
            this.generatePreview();
        });

        docxIncludeToc?.addEventListener('change', (e) => {
            this.exportConfig.docx.includeToc = e.target.checked;
        });

        // HTML Config
        const htmlTheme = document.getElementById('html-theme');
        const htmlCustomColor = document.getElementById('html-custom-color');
        const htmlCustomColorText = document.getElementById('html-custom-color-text');
        const htmlCustomColorContainer = document.getElementById('html-custom-color-container');
        const htmlIncludeStyles = document.getElementById('html-include-styles');

        htmlTheme?.addEventListener('change', (e) => {
            this.exportConfig.html.theme = e.target.value;
            if (e.target.value === 'custom') {
                htmlCustomColorContainer?.classList.remove('d-none');
            } else {
                htmlCustomColorContainer?.classList.add('d-none');
                if (e.target.value === 'dark') {
                    this.exportConfig.html.customColor = '#1C1F23';
                } else {
                    this.exportConfig.html.customColor = '#ffffff';
                }
            }
            this.generatePreview();
        });

        // Sincronizar color picker com text input para HTML
        htmlCustomColor?.addEventListener('change', (e) => {
            this.exportConfig.html.customColor = e.target.value;
            if (htmlCustomColorText) htmlCustomColorText.value = e.target.value;
            this.generatePreview();
        });

        htmlCustomColorText?.addEventListener('change', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                this.exportConfig.html.customColor = color;
                if (htmlCustomColor) htmlCustomColor.value = color;
                this.generatePreview();
            }
        });

        htmlIncludeStyles?.addEventListener('change', (e) => {
            this.exportConfig.html.includeStyles = e.target.checked;
            this.generatePreview();
        });
    }

    setupFormatEventListeners() {
        // Adicionar listeners para mudanças nas configurações
        const formatConfigs = document.querySelectorAll('.export-format-config input, .export-format-config select');
        formatConfigs.forEach(element => {
            element.addEventListener('change', () => {
                this.generatePreview();
            });
        });
    }

    updateFormatConfig() {
        // Mostrar/ocultar configurações específicas do formato
        const allConfigs = document.querySelectorAll('.export-format-config');
        allConfigs.forEach(config => config.classList.add('d-none'));

        const currentConfig = document.getElementById(`${this.currentFormat}-config`);
        if (currentConfig) {
            currentConfig.classList.remove('d-none');
        }
    }

    setCurrentDocument(document) {
        console.log('ExportManager: setCurrentDocument called with:', document);
        this.currentDocument = document;
        
        if (!document) {
            console.warn('ExportManager: No document provided to setCurrentDocument');
            this.showPreviewPlaceholder();
            return;
        }
        
        console.log('ExportManager: Document set successfully', {
            id: document.id,
            name: document.name,
            contentLength: document.content ? document.content.length : 0
        });
        
        this.generatePreview();
    }

    getCurrentDocument() {
        return this.currentDocument;
    }

    getExportConfig() {
        return this.exportConfig;
    }

    debugState() {
        console.log('ExportManager Debug State:', {
            currentDocument: this.currentDocument,
            currentFormat: this.currentFormat,
            exportConfig: this.exportConfig,
            hasElements: {
                exportFormatSelect: !!this.exportFormatSelect,
                exportPreviewContent: !!this.exportPreviewContent,
                exportDocumentBtn: !!this.exportDocumentBtn
            }
        });
    }

    generatePreview() {
        console.log('ExportManager: generatePreview called, currentDocument:', !!this.currentDocument, 'currentFormat:', this.currentFormat);
        
        if (!this.currentDocument) {
            this.showPreviewPlaceholder();
            return;
        }

        const content = this.currentDocument.content || '<p>Documento vazio</p>';
        console.log('ExportManager: Generating preview for format:', this.currentFormat, 'content length:', content.length);
        
        switch (this.currentFormat) {
            case 'pdf':
                this.generatePdfPreview(content);
                break;
            case 'docx':
                this.generateDocxPreview(content);
                break;
            case 'html':
                this.generateHtmlPreview(content);
                break;
            case 'txt':
                this.generateTxtPreview(content);
                break;
            case 'md':
                this.generateMarkdownPreview(content);
                break;
        }
    }

    generatePdfPreview(content) {
        const metadata = this.currentDocument.metadata || {};
        const title = metadata.title || 'Documento sem título';
        const date = new Date(metadata.lastModified || Date.now()).toLocaleDateString('pt-BR');
        
        // Determinar cor de fundo baseada no tema
        let backgroundColor = '#ffffff';
        let textColor = '#000000';
        
        switch (this.exportConfig.pdf.theme) {
            case 'dark':
                backgroundColor = '#1C1F23';
                textColor = '#e0e6eb';
                break;
            case 'custom':
                backgroundColor = this.exportConfig.pdf.customColor;
                // Calcular cor do texto baseada na luminosidade do fundo
                textColor = this.getContrastColor(backgroundColor);
                break;
            default:
                backgroundColor = '#ffffff';
                textColor = '#000000';
        }
        
        let previewHtml = '';
        
        if (this.exportConfig.pdf.includeMetadata) {
            previewHtml += `
                <div style="text-align: center; margin-bottom: 2rem; border-bottom: 1px solid ${textColor === '#000000' ? '#ccc' : '#555'}; padding-bottom: 1rem;">
                    <h1 style="color: ${textColor}; margin-bottom: 0.5rem;">${title}</h1>
                    <p style="color: ${textColor}; opacity: 0.7; font-style: italic;">Exportado em ${date}</p>
                </div>
            `;
        }
        
        previewHtml += content;
        
        this.exportPreviewContent.innerHTML = previewHtml;
        this.exportPreviewContent.className = 'export-preview-content pdf-preview';
        this.exportPreviewContent.style.backgroundColor = backgroundColor;
        this.exportPreviewContent.style.color = textColor;
        this.applyZoom();
    }

    generateDocxPreview(content) {
        const metadata = this.currentDocument.metadata || {};
        const title = metadata.title || 'Documento sem título';
        const fontSize = this.exportConfig.docx.fontSize;
        
        let previewHtml = `<div style="font-size: ${fontSize}pt; font-family: 'Times New Roman', serif;">`;
        
        if (this.exportConfig.docx.includeToc) {
            previewHtml += `
                <div style="page-break-after: always; margin-bottom: 2rem;">
                    <h2 style="text-align: center; color: #333;">Sumário</h2>
                    <div style="padding: 1rem; background: #f8f9fa; border-radius: 4px;">
                        <p style="font-style: italic; color: #666;">O sumário será gerado automaticamente baseado nos títulos do documento.</p>
                    </div>
                </div>
            `;
        }
        
        previewHtml += `
            <h1 style="color: #333; text-align: center; margin-bottom: 2rem;">${title}</h1>
            ${content}
        </div>`;
        
        this.exportPreviewContent.innerHTML = previewHtml;
        this.exportPreviewContent.className = 'export-preview-content docx-preview';
        this.applyZoom();
    }

    generateHtmlPreview(content) {
        const metadata = this.currentDocument.metadata || {};
        const title = metadata.title || 'Documento sem título';
        
        // Determinar cor de fundo baseada no tema
        let backgroundColor = '#ffffff';
        let textColor = '#000000';
        
        switch (this.exportConfig.html.theme) {
            case 'dark':
                backgroundColor = '#1C1F23';
                textColor = '#e0e6eb';
                break;
            case 'custom':
                backgroundColor = this.exportConfig.html.customColor;
                textColor = this.getContrastColor(backgroundColor);
                break;
            default:
                backgroundColor = '#ffffff';
                textColor = '#000000';
        }
        
        // Gerar estilos customizados para o tema
        const customStyles = `
            body { 
                background-color: ${backgroundColor} !important;
                color: ${textColor} !important;
            }
            h1, h2, h3, h4, h5, h6 { 
                color: ${textColor} !important; 
            }
            a { 
                color: ${textColor === '#000000' ? '#3498db' : '#74b9ff'} !important; 
            }
        `;
        
        const htmlContent = exportUtils.generateCleanHtml(
            content,
            title,
            { 
                includeMetadata: false, 
                includeStyles: this.exportConfig.html.includeStyles,
                customStyles: customStyles 
            }
        );
        
        this.exportPreviewContent.innerHTML = htmlContent;
        this.exportPreviewContent.className = 'export-preview-content html-preview';
        this.exportPreviewContent.style.backgroundColor = backgroundColor;
        this.exportPreviewContent.style.color = textColor;
        this.applyZoom();
    }

    generateTxtPreview(content) {
        const metadata = this.currentDocument.metadata || {};
        const title = metadata.title || 'Documento sem título';
        
        const textContent = exportUtils.htmlToText(content);
        const txtContent = `${title}\n${'='.repeat(title.length)}\n\n${textContent}`;
        
        this.exportPreviewContent.innerHTML = `<pre>${txtContent}</pre>`;
        this.exportPreviewContent.className = 'export-preview-content txt-preview';
        this.applyZoom();
    }

    generateMarkdownPreview(content) {
        const metadata = this.currentDocument.metadata || {};
        const title = metadata.title || 'Documento sem título';
        
        let markdownContent = `# ${title}\n\n`;
        markdownContent += exportUtils.htmlToMarkdown(content);
        
        this.exportPreviewContent.innerHTML = `<pre>${markdownContent}</pre>`;
        this.exportPreviewContent.className = 'export-preview-content md-preview';
        this.applyZoom();
    }

    showPreviewPlaceholder() {
        this.exportPreviewContent.innerHTML = `
            <div class="preview-placeholder text-center py-5">
                <i class="bi bi-file-earmark-text display-1 text-secondary"></i>
                <p class="text-muted">Nenhum documento selecionado</p>
            </div>
        `;
        this.exportPreviewContent.className = 'export-preview-content';
    }

    adjustZoom(delta) {
        this.currentZoom += delta;
        this.currentZoom = Math.max(50, Math.min(200, this.currentZoom));
        this.applyZoom();
        this.updateZoomDisplay();
    }

    resetZoom() {
        this.currentZoom = 100;
        this.applyZoom();
        this.updateZoomDisplay();
    }

    applyZoom() {
        const scale = this.currentZoom / 100;
        this.exportPreviewContent.style.transform = `scale(${scale})`;
    }

    updateZoomDisplay() {
        if (this.previewZoomReset) {
            this.previewZoomReset.textContent = `${this.currentZoom}%`;
        }
    }

    async exportDocument() {
        console.log('ExportManager: exportDocument called', {
            currentDocument: !!this.currentDocument,
            currentFormat: this.currentFormat
        });
        
        if (!this.currentDocument) {
            console.error('ExportManager: No document selected');
            this.showError('Nenhum documento selecionado para exportação');
            return;
        }

        try {
            this.showLoading('Preparando documento para exportação...');
            
            console.log('ExportManager: Starting export for format:', this.currentFormat);

            switch (this.currentFormat) {
                case 'pdf':
                    console.log('ExportManager: Exporting to PDF');
                    await this.exportToPdf();
                    break;
                case 'docx':
                    console.log('ExportManager: Exporting to DOCX');
                    await this.exportToDocx();
                    break;
                case 'html':
                    console.log('ExportManager: Exporting to HTML');
                    this.exportToHtml();
                    this.hideLoading();
                    this.showSuccess('Arquivo HTML exportado com sucesso!');
                    return; // Evitar mensagem duplicada
                case 'txt':
                    console.log('ExportManager: Exporting to TXT');
                    this.exportToTxt();
                    this.hideLoading();
                    this.showSuccess('Arquivo TXT exportado com sucesso!');
                    return; // Evitar mensagem duplicada
                case 'md':
                    console.log('ExportManager: Exporting to MD');
                    this.exportToMarkdown();
                    this.hideLoading();
                    this.showSuccess('Arquivo Markdown exportado com sucesso!');
                    return; // Evitar mensagem duplicada
                default:
                    console.error('ExportManager: Unknown format:', this.currentFormat);
                    throw new Error('Formato de exportação não suportado: ' + this.currentFormat);
            }

            this.hideLoading();
        } catch (error) {
            console.error('ExportManager: Export error:', error);
            this.hideLoading();
            this.showError('Erro ao exportar documento: ' + error.message);
        }
    }

    async exportToPdf() {
        console.log('ExportManager: exportToPdf called');
        
        const title = this.currentDocument.name || this.currentDocument.title || 'documento';
        const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}.pdf`;
        
        try {
            // Verificar se jsPDF está disponível
            if (typeof window.jspdf === 'undefined') {
                console.warn('jsPDF não está disponível, usando HTML como fallback');
                const htmlContent = this.generatePdfPreviewContent();
                this.downloadFile(htmlContent, `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}_para_PDF.html`, 'text/html');
                this.showInfo('PDF: Use Ctrl+P no arquivo HTML baixado e selecione "Salvar como PDF" para gerar o PDF final.');
                return;
            }

            const { jsPDF } = window.jspdf;
            
            // Configurar o PDF
            const orientation = this.exportConfig.pdf.orientation === 'landscape' ? 'l' : 'p';
            const format = this.exportConfig.pdf.pageSize.toUpperCase();
            
            const doc = new jsPDF({
                orientation: orientation,
                unit: 'mm',
                format: format
            });
            
            // Configurar tema e cores
            let backgroundColor = [255, 255, 255]; // Branco padrão
            let textColor = [40, 40, 40]; // Preto padrão
            
            if (this.exportConfig.pdf.theme === 'dark') {
                backgroundColor = [28, 31, 35]; // Fundo escuro CROM
                textColor = [224, 230, 235]; // Texto claro
            } else if (this.exportConfig.pdf.theme === 'custom') {
                backgroundColor = this.hexToRgb(this.exportConfig.pdf.customColor);
                textColor = this.hexToRgb(this.getContrastColor(this.exportConfig.pdf.customColor));
            }
            
            // Função para adicionar fundo colorido em cada página
            const addPageBackground = () => {
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                
                // Definir cor de preenchimento
                doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
                
                // Adicionar retângulo de fundo cobrindo toda a página
                doc.rect(0, 0, pageWidth, pageHeight, 'F');
            };
            
            // Adicionar fundo à primeira página
            addPageBackground();
            
            // Configurar cor do texto
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            
            // Adicionar título
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            
            // Calcular posição do título (centralizado)
            const pageWidth = doc.internal.pageSize.getWidth();
            const titleWidth = doc.getTextWidth(title);
            const titleX = (pageWidth - titleWidth) / 2;
            
            doc.text(title, titleX, 25);
            
            // Adicionar linha separadora
            doc.setLineWidth(0.5);
            doc.setDrawColor(textColor[0], textColor[1], textColor[2]);
            doc.line(20, 30, pageWidth - 20, 30);
            
            // Processar conteúdo
            const content = this.currentDocument.content || '<p>Documento vazio</p>';
            const textContent = this.extractTextFromHtml(content);
            
            // Adicionar conteúdo ao PDF
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            
            // Dividir texto em páginas
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const lineHeight = 7;
            let currentY = 40;
            
            const lines = doc.splitTextToSize(textContent, pageWidth - 2 * margin);
            
            for (let i = 0; i < lines.length; i++) {
                if (currentY + lineHeight > pageHeight - margin) {
                    doc.addPage();
                    // Adicionar fundo à nova página
                    addPageBackground();
                    // Reconfigurar cor do texto após adicionar nova página
                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                    currentY = margin;
                }
                
                doc.text(lines[i], margin, currentY);
                currentY += lineHeight;
            }
            
            // Adicionar metadados se configurado
            if (this.exportConfig.pdf.includeMetadata) {
                const date = new Date().toLocaleDateString('pt-BR');
                doc.setProperties({
                    title: title,
                    subject: 'Documento CROM',
                    author: 'CROM Docs',
                    creator: 'CROM Docs',
                    keywords: 'documento, crom, export',
                    creationDate: new Date()
                });
            }
            
            // Salvar o PDF
            doc.save(filename);
            
            console.log('ExportManager: PDF exported successfully:', filename);
            
        } catch (error) {
            console.error('ExportManager: Error exporting PDF:', error);
            // Fallback para HTML
            const htmlContent = this.generatePdfPreviewContent();
            this.downloadFile(htmlContent, `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}_para_PDF.html`, 'text/html');
            this.showInfo('PDF: Use Ctrl+P no arquivo HTML baixado e selecione "Salvar como PDF" para gerar o PDF final.');
        }
    }

    generatePdfPreviewContent() {
        const title = this.currentDocument.name || this.currentDocument.title || 'documento';
        const date = new Date(this.currentDocument.lastModified || Date.now()).toLocaleDateString('pt-BR');
        
        // Determinar cor de fundo baseada no tema
        let backgroundColor = '#ffffff';
        let textColor = '#000000';
        
        switch (this.exportConfig.pdf.theme) {
            case 'dark':
                backgroundColor = '#1C1F23';
                textColor = '#e0e6eb';
                break;
            case 'custom':
                backgroundColor = this.exportConfig.pdf.customColor;
                textColor = this.getContrastColor(backgroundColor);
                break;
            default:
                backgroundColor = '#ffffff';
                textColor = '#000000';
        }
        
        const customStyles = `
            @media print {
                body { 
                    background-color: ${backgroundColor} !important;
                    color: ${textColor} !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
            body { 
                background-color: ${backgroundColor} !important;
                color: ${textColor} !important;
                font-family: 'Times New Roman', serif;
                line-height: 1.6;
                margin: 0;
                padding: 2cm;
            }
            h1, h2, h3, h4, h5, h6 { 
                color: ${textColor} !important; 
                page-break-after: avoid;
            }
            p { 
                page-break-inside: avoid;
                orphans: 3;
                widows: 3;
            }
            .pdf-header {
                text-align: center;
                border-bottom: 2px solid ${textColor === '#000000' ? '#3498db' : '#74b9ff'};
                padding-bottom: 1rem;
                margin-bottom: 2rem;
            }
        `;
        
        let content = this.currentDocument.content || '<p>Documento vazio</p>';
        if (this.exportConfig.pdf.includeMetadata) {
            content = `
                <div class="pdf-header">
                    <h1>${title}</h1>
                    <p style="color: ${textColor === '#000000' ? '#666' : '#b0b0b0'}; font-style: italic;">Exportado em ${date}</p>
                </div>
                ${content}
            `;
        }
        
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>${customStyles}</style>
</head>
<body>
    ${content}
</body>
</html>`;
    }

    async exportToDocx() {
        console.log('ExportManager: exportToDocx called');
        
        const title = this.currentDocument.name || this.currentDocument.title || 'documento';
        const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}.docx`;
        
        try {
            // Verificar se docx está disponível
            if (typeof window.docx === 'undefined') {
                console.warn('docx library não está disponível, usando HTML como fallback');
                const htmlContent = this.generateDocxPreviewContent();
                this.downloadFile(htmlContent, `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}_para_Word.html`, 'text/html');
                this.showInfo('Word: Abra o arquivo HTML baixado no Microsoft Word e salve como .docx para obter o documento final.');
                return;
            }

            const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = window.docx;
            
            // Criar documento
            const content = this.currentDocument.content || '<p>Documento vazio</p>';
            
            // Processar conteúdo HTML para elementos do Word
            const children = await this.htmlToDocxElements(content, title);
            
            const doc = new Document({
                sections: [{
                    properties: {
                        page: {
                            margin: {
                                top: 1440,    // 1 inch
                                right: 1440,  // 1 inch
                                bottom: 1440, // 1 inch
                                left: 1440,   // 1 inch
                            }
                        }
                    },
                    children: children
                }]
            });
            
            // Gerar e baixar o arquivo
            const buffer = await Packer.toBlob(doc);
            
            // Criar link para download
            const url = URL.createObjectURL(buffer);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log('ExportManager: DOCX exported successfully:', filename);
            
        } catch (error) {
            console.error('ExportManager: Error exporting DOCX:', error);
            // Fallback para HTML
            const htmlContent = this.generateDocxPreviewContent();
            this.downloadFile(htmlContent, `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}_para_Word.html`, 'text/html');
            this.showInfo('Word: Abra o arquivo HTML baixado no Microsoft Word e salve como .docx para obter o documento final.');
        }
    }

    generateDocxPreviewContent() {
        const title = this.currentDocument.name || this.currentDocument.title || 'documento';
        const fontSize = this.exportConfig.docx.fontSize;
        
        let content = this.currentDocument.content || '<p>Documento vazio</p>';
        
        if (this.exportConfig.docx.includeToc) {
            content = `
                <div style="page-break-after: always;">
                    <h2 style="text-align: center;">Sumário</h2>
                    <p style="font-style: italic; color: #666;">O sumário será gerado automaticamente pelo Word baseado nos títulos do documento.</p>
                </div>
                ${content}
            `;
        }
        
        const customStyles = `
            body { 
                font-family: 'Times New Roman', serif;
                font-size: ${fontSize}pt;
                line-height: 1.6;
                color: #000;
                background: white;
                margin: 2.5cm;
            }
            h1 { text-align: center; margin-bottom: 2rem; }
            h1, h2, h3, h4, h5, h6 { 
                color: #333; 
                page-break-after: avoid;
            }
            p { 
                text-align: justify;
                page-break-inside: avoid;
                orphans: 3;
                widows: 3;
            }
        `;
        
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>${customStyles}</style>
</head>
<body>
    <h1>${title}</h1>
    ${content}
</body>
</html>`;
    }

    exportToHtml() {
        const title = this.currentDocument.name || this.currentDocument.title || 'documento';
        const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}.html`;
        
        // Determinar cor de fundo baseada no tema
        let backgroundColor = '#ffffff';
        let textColor = '#000000';
        
        switch (this.exportConfig.html.theme) {
            case 'dark':
                backgroundColor = '#1C1F23';
                textColor = '#e0e6eb';
                break;
            case 'custom':
                backgroundColor = this.exportConfig.html.customColor;
                textColor = this.getContrastColor(backgroundColor);
                break;
            default:
                backgroundColor = '#ffffff';
                textColor = '#000000';
        }
        
        // Gerar estilos customizados para o tema
        const customStyles = `
            body { 
                background-color: ${backgroundColor} !important;
                color: ${textColor} !important;
            }
            h1, h2, h3, h4, h5, h6 { 
                color: ${textColor} !important; 
            }
            a { 
                color: ${textColor === '#000000' ? '#3498db' : '#74b9ff'} !important; 
            }
            blockquote {
                border-left: 4px solid ${textColor === '#000000' ? '#3498db' : '#74b9ff'};
                color: ${textColor === '#000000' ? '#666' : '#b0b0b0'};
            }
            code {
                background: ${textColor === '#000000' ? '#f4f4f4' : '#2c3e50'};
                color: ${textColor === '#000000' ? '#000' : '#e0e6eb'};
            }
            pre {
                background: ${textColor === '#000000' ? '#f4f4f4' : '#2c3e50'};
                color: ${textColor === '#000000' ? '#000' : '#e0e6eb'};
            }
            hr {
                border-top: 1px solid ${textColor === '#000000' ? '#ddd' : '#555'};
            }
            .header {
                border-bottom: 2px solid ${textColor === '#000000' ? '#3498db' : '#74b9ff'};
            }
            .footer {
                border-top: 1px solid ${textColor === '#000000' ? '#ddd' : '#555'};
                color: ${textColor === '#000000' ? '#666' : '#b0b0b0'};
            }
        `;
        
        const htmlContent = exportUtils.generateCleanHtml(
            this.currentDocument.content || '<p>Documento vazio</p>',
            title,
            { 
                includeMetadata: true, 
                includeStyles: this.exportConfig.html.includeStyles,
                customStyles: customStyles 
            }
        );
        
        this.downloadFile(htmlContent, filename, 'text/html');
    }

    exportToTxt() {
        const title = this.currentDocument.name || this.currentDocument.title || 'documento';
        const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}.txt`;
        
        const textContent = exportUtils.htmlToText(this.currentDocument.content || '');
        const txtContent = `${title}\n${'='.repeat(title.length)}\n\n${textContent}`;
        
        this.downloadFile(txtContent, filename, 'text/plain');
    }

    exportToMarkdown() {
        const title = this.currentDocument.name || this.currentDocument.title || 'documento';
        const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '_')}.md`;
        
        let markdownContent = `# ${title}\n\n`;
        markdownContent += exportUtils.htmlToMarkdown(this.currentDocument.content || '');
        
        this.downloadFile(markdownContent, filename, 'text/markdown');
    }

    convertHtmlToMarkdown(element) {
        return exportUtils.convertElementToMarkdown(element);
    }

    downloadFile(content, filename, mimeType) {
        console.log('ExportManager: downloadFile called with:', {
            contentLength: content.length,
            filename,
            mimeType
        });
        
        try {
            // Sanitizar o nome do arquivo
            const sanitizedFilename = filename.replace(/[<>:"/\\|?*]/g, '_');
            
            const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = sanitizedFilename;
            a.style.display = 'none';
            
            // Adicionar ao DOM temporariamente
            document.body.appendChild(a);
            
            // Trigger download
            a.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log('ExportManager: File download triggered successfully for:', sanitizedFilename);
        } catch (error) {
            console.error('ExportManager: Error in downloadFile:', error);
            this.showError('Erro ao baixar arquivo: ' + error.message);
        }
    }

    async sendDocumentByEmail() {
        const email = this.exportEmailInput?.value.trim();
        const message = this.exportEmailMessage?.value.trim();
        
        if (!email) {
            this.showError('Por favor, insira um endereço de email válido');
            return;
        }
        
        if (!this.currentDocument) {
            this.showError('Nenhum documento selecionado para envio');
            return;
        }
        
        try {
            this.showLoading('Enviando documento por email...');
            
            // Por enquanto, mostrar placeholder
            this.showInfo('Funcionalidade de envio por email será implementada em breve. Por favor, exporte o documento e envie manualmente.');
            
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError('Erro ao enviar email: ' + error.message);
        }
    }

    showLoading(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Processando...',
                text: message,
                background: '#24282e',
                color: '#e0e6eb',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        } else {
            console.log('Loading:', message);
        }
    }

    hideLoading() {
        if (typeof Swal !== 'undefined') {
            Swal.close();
        } else {
            console.log('Hiding loading');
        }
    }

    showSuccess(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: message,
                background: '#24282e',
                color: '#e0e6eb',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            console.log('Success:', message);
        }
    }

    showError(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: message,
                background: '#24282e',
                color: '#e0e6eb'
            });
        } else {
            console.log('Error:', message);
        }
    }

    showInfo(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'info',
                title: 'Informação',
                text: message,
                background: '#24282e',
                color: '#e0e6eb'
            });
        } else {
            console.log('Info:', message);
        }
    }

    /**
     * Calcula a cor de texto mais adequada baseada na luminosidade da cor de fundo
     * @param {string} backgroundColor - Cor de fundo em formato hex
     * @returns {string} - Cor de texto (#000000 ou #e0e6eb)
     */
    getContrastColor(backgroundColor) {
        // Converter hex para RGB usando a função hexToRgb
        const [r, g, b] = this.hexToRgb(backgroundColor);
        
        // Calcular luminosidade relativa
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Retornar cor de texto baseada na luminosidade
        return luminance > 0.5 ? '#000000' : '#e0e6eb';
    }

    /**
     * Extrai texto limpo do HTML para uso em PDF, preservando estrutura básica
     * @param {string} html - Conteúdo HTML
     * @returns {string} - Texto limpo com estrutura preservada
     */
    extractTextFromHtml(html) {
        try {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Remover elementos script e style
            const scripts = tempDiv.querySelectorAll('script, style');
            scripts.forEach(el => el.remove());
            
            let result = '';
            
            // Processar elementos de forma recursiva
            const processNode = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent.trim();
                    if (text) {
                        result += text + ' ';
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    
                    // Adicionar quebras de linha antes de certos elementos
                    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'br'].includes(tagName)) {
                        if (result && !result.endsWith('\n')) {
                            result += '\n';
                        }
                    }
                    
                    // Processar títulos com marcadores
                    if (tagName.match(/^h[1-6]$/)) {
                        const level = parseInt(tagName[1]);
                        const marker = '#'.repeat(level) + ' ';
                        result += marker;
                    }
                    
                    // Processar listas
                    if (tagName === 'li') {
                        result += '• ';
                    }
                    
                    // Processar filhos
                    node.childNodes.forEach(child => processNode(child));
                    
                    // Adicionar quebras de linha após certos elementos
                    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'li'].includes(tagName)) {
                        result += '\n';
                    }
                    
                    // Adicionar espaçamento extra após títulos
                    if (tagName.match(/^h[1-6]$/)) {
                        result += '\n';
                    }
                }
            };
            
            // Processar todos os nós
            tempDiv.childNodes.forEach(child => processNode(child));
            
            // Limpar múltiplas quebras de linha
            result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
            
            return result.trim();
            
        } catch (error) {
            console.error('Error extracting text from HTML:', error);
            return html.replace(/<[^>]*>/g, ''); // Fallback: remover tags HTML
        }
    }

    /**
     * Converte HTML para elementos do DOCX
     * @param {string} html - Conteúdo HTML
     * @param {string} title - Título do documento
     * @returns {Array} - Array de elementos do docx
     */
    async htmlToDocxElements(html, title) {
        try {
            const { Paragraph, TextRun, HeadingLevel, AlignmentType } = window.docx;
            
            const elements = [];
            
            // Adicionar título
            elements.push(new Paragraph({
                children: [
                    new TextRun({
                        text: title,
                        bold: true,
                        size: 32
                    })
                ],
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER
            }));
            
            // Adicionar linha em branco
            elements.push(new Paragraph({
                children: [new TextRun({ text: "" })]
            }));
            
            // Processar conteúdo HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Processar elementos
            const processElement = (element) => {
                const tagName = element.tagName?.toLowerCase();
                const text = element.textContent || '';
                
                if (!text.trim()) return null;
                
                switch (tagName) {
                    case 'h1':
                        return new Paragraph({
                            children: [new TextRun({ text: text, bold: true, size: 28 })],
                            heading: HeadingLevel.HEADING_1
                        });
                    case 'h2':
                        return new Paragraph({
                            children: [new TextRun({ text: text, bold: true, size: 24 })],
                            heading: HeadingLevel.HEADING_2
                        });
                    case 'h3':
                        return new Paragraph({
                            children: [new TextRun({ text: text, bold: true, size: 20 })],
                            heading: HeadingLevel.HEADING_3
                        });
                    case 'p':
                    case 'div':
                        return new Paragraph({
                            children: [new TextRun({ 
                                text: text,
                                size: this.exportConfig.docx.fontSize * 2 // DOCX usa half-points
                            })]
                        });
                    case 'li':
                        return new Paragraph({
                            children: [new TextRun({ 
                                text: `• ${text}`,
                                size: this.exportConfig.docx.fontSize * 2
                            })]
                        });
                    default:
                        if (text.trim()) {
                            return new Paragraph({
                                children: [new TextRun({ 
                                    text: text,
                                    size: this.exportConfig.docx.fontSize * 2
                                })]
                            });
                        }
                        return null;
                }
            };
            
            // Processar todos os elementos
            const processedElements = Array.from(tempDiv.children).map(processElement).filter(Boolean);
            
            // Se não houver elementos processados, adicionar conteúdo padrão
            if (processedElements.length === 0) {
                const textContent = this.extractTextFromHtml(html);
                const paragraphs = textContent.split('\n\n').filter(p => p.trim());
                
                paragraphs.forEach(paragraph => {
                    elements.push(new Paragraph({
                        children: [new TextRun({ 
                            text: paragraph.trim(),
                            size: this.exportConfig.docx.fontSize * 2
                        })]
                    }));
                });
            } else {
                elements.push(...processedElements);
            }
            
            return elements;
            
        } catch (error) {
            console.error('Error converting HTML to DOCX elements:', error);
            // Fallback: criar parágrafo simples
            const { Paragraph, TextRun } = window.docx;
            const textContent = this.extractTextFromHtml(html);
            
            return [
                new Paragraph({
                    children: [new TextRun({ 
                        text: title,
                        bold: true,
                        size: 32
                    })]
                }),
                new Paragraph({
                    children: [new TextRun({ text: "" })]
                }),
                new Paragraph({
                    children: [new TextRun({ text: textContent })]
                })
            ];
        }
    }

    /**
     * Converte cor hexadecimal para RGB
     * @param {string} hex - Cor em formato hex (#RRGGBB)
     * @returns {Array} - Array [R, G, B]
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
}

export default ExportManager;
