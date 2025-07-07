/**
 * WordProcessor - Processa arquivos Word (.docx) usando mammoth.js
 */
class WordProcessor {
    constructor() {
        this.name = 'WordProcessor';
        this.supportedTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx'];
        this.mammoth = null;
    }

    /**
     * Carrega a biblioteca mammoth.js
     */
    async loadMammothLib() {
        if (this.mammoth) {
            return this.mammoth;
        }

        try {
            // Tenta carregar mammoth.js via CDN
            if (typeof mammoth === 'undefined') {
                await this.loadMammothFromCDN();
            }
            
            this.mammoth = mammoth;
            return this.mammoth;
            
        } catch (error) {
            console.error('Erro ao carregar mammoth.js:', error);
            throw new Error('Não foi possível carregar a biblioteca mammoth.js');
        }
    }

    /**
     * Carrega mammoth.js do CDN
     */
    async loadMammothFromCDN() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Processa arquivo Word
     */
    async process(file, options = {}) {
        try {
            const mammothLib = await this.loadMammothLib();
            
            // Converte arquivo para ArrayBuffer
            const arrayBuffer = await this.fileToArrayBuffer(file);
            
            // Configurações de conversão
            const convertOptions = {
                convertImage: mammoth.images.imgElement(function(image) {
                    return image.read("base64").then(function(imageBuffer) {
                        return {
                            src: "data:" + image.contentType + ";base64," + imageBuffer
                        };
                    });
                }),
                ...options.mammothOptions
            };
            
            // Converte para HTML
            const result = await mammothLib.convertToHtml({ arrayBuffer }, convertOptions);
            
            // Processa o HTML resultante
            const processedHTML = this.processHTML(result.value, options);
            
            // Extrai metadados
            const metadata = this.extractMetadata(result, options);
            
            return {
                content: processedHTML,
                metadata: {
                    originalFormat: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ...metadata,
                    warnings: result.messages || []
                },
                title: this.extractTitle(processedHTML) || 'Documento Word'
            };
            
        } catch (error) {
            console.error('Erro ao processar arquivo Word:', error);
            throw new Error(`Erro ao processar arquivo Word: ${error.message}`);
        }
    }

    /**
     * Converte File para ArrayBuffer
     */
    fileToArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = (e) => {
                reject(new Error('Erro ao ler arquivo Word'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Processa HTML gerado pelo mammoth
     */
    processHTML(html, options = {}) {
        if (!html || html.trim() === '') {
            return '<p>Documento Word vazio</p>';
        }
        
        // Remove estilos inline desnecessários se solicitado
        if (options.removeInlineStyles !== false) {
            html = this.removeInlineStyles(html);
        }
        
        // Limpa HTML
        html = this.cleanHTML(html);
        
        // Processa imagens se necessário
        if (options.processImages !== false) {
            html = this.processImages(html);
        }
        
        return html;
    }

    /**
     * Remove estilos inline
     */
    removeInlineStyles(html) {
        // Remove atributos de estilo inline
        return html
            .replace(/\sstyle="[^"]*"/gi, '')
            .replace(/\sclass="[^"]*"/gi, '')
            .replace(/\sid="[^"]*"/gi, '');
    }

    /**
     * Limpa HTML
     */
    cleanHTML(html) {
        // Remove tags vazias
        html = html.replace(/<p[^>]*>\s*<\/p>/gi, '');
        html = html.replace(/<span[^>]*>\s*<\/span>/gi, '');
        html = html.replace(/<div[^>]*>\s*<\/div>/gi, '');
        
        // Remove espaços excessivos
        html = html.replace(/\s+/g, ' ');
        
        // Remove quebras de linha desnecessárias
        html = html.replace(/\n\s*\n/g, '\n');
        
        return html.trim();
    }

    /**
     * Processa imagens
     */
    processImages(html) {
        // Adiciona classes para imagens
        html = html.replace(/<img([^>]*)>/gi, '<img$1 class="img-fluid">');
        
        // Processa imagens base64 muito grandes
        html = html.replace(/<img[^>]*src="data:image\/[^;]+;base64,([^"]*)"[^>]*>/gi, (match, base64) => {
            if (base64.length > 100000) { // Se muito grande (>100KB)
                return '<div class="alert alert-info"><i class="bi bi-image"></i> Imagem removida (muito grande)</div>';
            }
            return match;
        });
        
        return html;
    }

    /**
     * Extrai título do documento
     */
    extractTitle(html) {
        // Tenta extrair título do primeiro heading
        const headingMatch = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
        if (headingMatch) {
            return this.stripHTML(headingMatch[1]).substring(0, 100);
        }
        
        // Tenta extrair do primeiro parágrafo
        const paragraphMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);
        if (paragraphMatch) {
            const text = this.stripHTML(paragraphMatch[1]).substring(0, 50);
            return text.length > 0 ? text + '...' : null;
        }
        
        return null;
    }

    /**
     * Remove tags HTML
     */
    stripHTML(html) {
        return html.replace(/<[^>]*>/g, '').trim();
    }

    /**
     * Extrai metadados
     */
    extractMetadata(result, options = {}) {
        const metadata = {};
        
        // Conta elementos HTML
        const html = result.value;
        
        metadata.headings = {
            h1: (html.match(/<h1[^>]*>/gi) || []).length,
            h2: (html.match(/<h2[^>]*>/gi) || []).length,
            h3: (html.match(/<h3[^>]*>/gi) || []).length,
            h4: (html.match(/<h4[^>]*>/gi) || []).length,
            h5: (html.match(/<h5[^>]*>/gi) || []).length,
            h6: (html.match(/<h6[^>]*>/gi) || []).length
        };
        
        metadata.paragraphs = (html.match(/<p[^>]*>/gi) || []).length;
        metadata.images = (html.match(/<img[^>]*>/gi) || []).length;
        metadata.tables = (html.match(/<table[^>]*>/gi) || []).length;
        metadata.lists = (html.match(/<[ou]l[^>]*>/gi) || []).length;
        
        // Conta caracteres e palavras
        const plainText = this.stripHTML(html);
        metadata.characters = plainText.length;
        metadata.words = plainText.split(/\s+/).filter(word => word.length > 0).length;
        
        // Informações sobre conversão
        if (result.messages && result.messages.length > 0) {
            metadata.conversionWarnings = result.messages.length;
            metadata.hasConversionIssues = result.messages.some(msg => msg.type === 'error');
        }
        
        return metadata;
    }

    /**
     * Pré-visualização do arquivo
     */
    async preview(file, maxLength = 500) {
        try {
            const mammothLib = await this.loadMammothLib();
            const arrayBuffer = await this.fileToArrayBuffer(file);
            
            // Converte apenas para texto para preview rápido
            const result = await mammothLib.extractRawText({ arrayBuffer });
            const text = result.value;
            
            const preview = text.length > maxLength ? 
                text.substring(0, maxLength) + '...' : text;
            
            return {
                preview,
                stats: {
                    characters: text.length,
                    words: text.split(/\s+/).filter(word => word.length > 0).length,
                    warnings: result.messages ? result.messages.length : 0
                }
            };
            
        } catch (error) {
            throw new Error(`Erro ao gerar preview: ${error.message}`);
        }
    }

    /**
     * Converte apenas para texto
     */
    async extractText(file) {
        try {
            const mammothLib = await this.loadMammothLib();
            const arrayBuffer = await this.fileToArrayBuffer(file);
            
            const result = await mammothLib.extractRawText({ arrayBuffer });
            return result.value;
            
        } catch (error) {
            throw new Error(`Erro ao extrair texto: ${error.message}`);
        }
    }

    /**
     * Verifica se mammoth.js está disponível
     */
    static async isAvailable() {
        try {
            const processor = new WordProcessor();
            await processor.loadMammothLib();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtém opções de conversão personalizadas
     */
    getConversionOptions(options = {}) {
        const defaultOptions = {
            convertImage: mammoth.images.imgElement(function(image) {
                return image.read("base64").then(function(imageBuffer) {
                    return {
                        src: "data:" + image.contentType + ";base64," + imageBuffer
                    };
                });
            }),
            styleMap: [
                "p[style-name='Heading 1'] => h1:fresh",
                "p[style-name='Heading 2'] => h2:fresh",
                "p[style-name='Heading 3'] => h3:fresh",
                "p[style-name='Heading 4'] => h4:fresh",
                "p[style-name='Heading 5'] => h5:fresh",
                "p[style-name='Heading 6'] => h6:fresh"
            ]
        };
        
        return { ...defaultOptions, ...options };
    }
}

export default WordProcessor;
