/**
 * FileImportManager - Gerencia a importação de diferentes tipos de arquivo
 */
class FileImportManager {
    constructor() {
        this.supportedTypes = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/msword': 'doc',
            'text/html': 'html',
            'text/plain': 'txt',
            'text/markdown': 'md',
            'application/rtf': 'rtf'
        };
        
        this.processors = {};
        this.initializeProcessors();
    }

    /**
     * Inicializa os processadores de arquivo
     */
    async initializeProcessors() {
        // Dinamicamente importa os processadores conforme necessário
        this.processors = {
            pdf: null, // Será carregado quando necessário
            docx: null,
            doc: null,
            html: null,
            txt: null,
            md: null,
            rtf: null
        };
    }

    /**
     * Verifica se o tipo de arquivo é suportado
     */
    isSupported(file) {
        return this.supportedTypes.hasOwnProperty(file.type) || 
               this.getTypeFromExtension(file.name) !== null;
    }

    /**
     * Obtém o tipo de arquivo pela extensão
     */
    getTypeFromExtension(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const extensionMap = {
            'pdf': 'pdf',
            'docx': 'docx',
            'doc': 'doc',
            'html': 'html',
            'htm': 'html',
            'txt': 'txt',
            'md': 'md',
            'markdown': 'md',
            'rtf': 'rtf'
        };
        return extensionMap[extension] || null;
    }

    /**
     * Processa um arquivo e retorna o conteúdo
     */
    async processFile(file, options = {}) {
        try {
            console.log('Processando arquivo:', file.name, 'tipo:', file.type);
            
            const fileType = this.supportedTypes[file.type] || this.getTypeFromExtension(file.name);
            
            if (!fileType) {
                throw new Error(`Tipo de arquivo não suportado: ${file.type}`);
            }

            console.log('Tipo de arquivo detectado:', fileType);

            // Carrega o processador específico se necessário
            if (!this.processors[fileType]) {
                console.log('Carregando processador para:', fileType);
                await this.loadProcessor(fileType);
            }

            const processor = this.processors[fileType];
            if (!processor) {
                throw new Error(`Processador não disponível para: ${fileType}`);
            }

            console.log('Processador carregado:', processor.constructor.name);

            const result = await processor.process(file, options);
            
            console.log('Resultado do processamento:', result);
            
            // Para HTML, converte para formato de editor
            let editorContent = result.content;
            if (fileType === 'html' && processor.convertForEditor) {
                console.log('Convertendo HTML para formato de editor');
                editorContent = processor.convertForEditor(result.content);
                console.log('Conteúdo convertido para editor:', editorContent);
            }
            
            // Determina o título adequado
            let documentTitle = result.title || this.extractTitleFromFilename(file.name);
            
            // Se o título extraído for genérico ou igual ao nome do arquivo sem extensão, usa um título mais apropriado
            const fileNameWithoutExt = this.extractTitleFromFilename(file.name);
            if (!result.title || 
                result.title === 'documento' || 
                result.title === 'Documento HTML' ||
                result.title === fileNameWithoutExt) {
                
                // Tenta extrair um título melhor do conteúdo
                const betterTitle = this.extractTitleFromContent(editorContent);
                documentTitle = betterTitle || `Documento Importado - ${fileNameWithoutExt}`;
            }
            
            console.log('Título final do documento:', documentTitle);
            
            return {
                success: true,
                type: fileType,
                filename: file.name,
                size: file.size,
                content: editorContent,
                metadata: {
                    ...result.metadata,
                    characters: editorContent.length,
                    words: editorContent.split(/\s+/).filter(w => w.length > 0).length,
                    paragraphs: (editorContent.match(/<p[^>]*>/g) || []).length
                },
                title: documentTitle
            };

        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            return {
                success: false,
                error: error.message,
                filename: file.name
            };
        }
    }

    /**
     * Carrega um processador específico
     */
    async loadProcessor(type) {
        try {
            let processorModule;
            
            switch(type) {
                case 'pdf':
                    processorModule = await import('../processors/PDFProcessor.js');
                    break;
                case 'docx':
                case 'doc':
                    processorModule = await import('../processors/WordProcessor.js');
                    break;
                case 'html':
                    processorModule = await import('../processors/HTMLProcessor.js');
                    break;
                case 'txt':
                    processorModule = await import('../processors/TextProcessor.js');
                    break;
                case 'md':
                    processorModule = await import('../processors/MarkdownProcessor.js');
                    break;
                case 'rtf':
                    processorModule = await import('../processors/RTFProcessor.js');
                    break;
                default:
                    throw new Error(`Processador não encontrado para tipo: ${type}`);
            }

            this.processors[type] = new processorModule.default();
            
        } catch (error) {
            console.error(`Erro ao carregar processador ${type}:`, error);
            throw error;
        }
    }

    /**
     * Extrai título do nome do arquivo
     */
    extractTitleFromFilename(filename) {
        return filename.split('.').slice(0, -1).join('.');
    }

    /**
     * Extrai um título melhor do conteúdo HTML
     */
    extractTitleFromContent(htmlContent) {
        try {
            // Cria um elemento temporário para parsing
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            // Procura por headings h1-h3
            const h1 = tempDiv.querySelector('h1');
            if (h1 && h1.textContent.trim()) {
                const title = h1.textContent.trim();
                // Verifica se não é um título genérico
                if (title.length > 2 && title.length < 100 && 
                    !title.toLowerCase().includes('documento') &&
                    !title.toLowerCase().includes('untitled')) {
                    return title;
                }
            }
            
            const h2 = tempDiv.querySelector('h2');
            if (h2 && h2.textContent.trim()) {
                const title = h2.textContent.trim();
                if (title.length > 2 && title.length < 100 && 
                    !title.toLowerCase().includes('documento') &&
                    !title.toLowerCase().includes('untitled')) {
                    return title;
                }
            }
            
            const h3 = tempDiv.querySelector('h3');
            if (h3 && h3.textContent.trim()) {
                const title = h3.textContent.trim();
                if (title.length > 2 && title.length < 100 && 
                    !title.toLowerCase().includes('documento') &&
                    !title.toLowerCase().includes('untitled')) {
                    return title;
                }
            }
            
            // Se não encontrou headings bons, pega as primeiras palavras do primeiro parágrafo
            const firstP = tempDiv.querySelector('p');
            if (firstP && firstP.textContent.trim()) {
                const text = firstP.textContent.trim();
                const words = text.split(/\s+/).slice(0, 5); // Primeiras 5 palavras
                if (words.length > 0 && words.join(' ').length < 50) {
                    return words.join(' ') + (text.split(/\s+/).length > 5 ? '...' : '');
                }
            }
            
            return null;
            
        } catch (error) {
            console.error('Erro ao extrair título do conteúdo:', error);
            return null;
        }
    }

    /**
     * Obtém informações sobre tipos suportados
     */
    getSupportedTypes() {
        return {
            'PDF': {
                extensions: ['.pdf'],
                mimeType: 'application/pdf',
                description: 'Documentos PDF'
            },
            'Word': {
                extensions: ['.docx', '.doc'],
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                description: 'Documentos Microsoft Word'
            },
            'HTML': {
                extensions: ['.html', '.htm'],
                mimeType: 'text/html',
                description: 'Páginas HTML'
            },
            'Texto': {
                extensions: ['.txt'],
                mimeType: 'text/plain',
                description: 'Arquivos de texto simples'
            },
            'Markdown': {
                extensions: ['.md', '.markdown'],
                mimeType: 'text/markdown',
                description: 'Arquivos Markdown'
            },
            'RTF': {
                extensions: ['.rtf'],
                mimeType: 'application/rtf',
                description: 'Rich Text Format'
            }
        };
    }

    /**
     * Valida arquivo antes do processamento
     */
    validateFile(file, maxSize = 10 * 1024 * 1024) { // 10MB por padrão
        const errors = [];

        if (!file) {
            errors.push('Nenhum arquivo selecionado');
            return { valid: false, errors };
        }

        if (!this.isSupported(file)) {
            errors.push(`Tipo de arquivo não suportado: ${file.type || 'desconhecido'}`);
        }

        if (file.size > maxSize) {
            errors.push(`Arquivo muito grande. Tamanho máximo: ${this.formatFileSize(maxSize)}`);
        }

        if (file.size === 0) {
            errors.push('Arquivo está vazio');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Formata tamanho do arquivo
     */
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
}

export default FileImportManager;
