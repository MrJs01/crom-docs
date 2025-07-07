/**
 * PDFProcessor - Processa arquivos PDF usando PDF.js
 */
class PDFProcessor {
    constructor() {
        this.name = 'PDFProcessor';
        this.supportedTypes = ['application/pdf', 'pdf'];
        this.pdfLib = null;
    }

    /**
     * Carrega a biblioteca PDF.js
     */
    async loadPDFLib() {
        if (this.pdfLib) {
            return this.pdfLib;
        }

        try {
            // Tenta carregar PDF.js via CDN
            if (typeof pdfjsLib === 'undefined') {
                await this.loadPDFJSFromCDN();
            }
            
            this.pdfLib = pdfjsLib;
            
            // Configura o worker
            if (this.pdfLib.GlobalWorkerOptions) {
                this.pdfLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }
            
            return this.pdfLib;
            
        } catch (error) {
            console.error('Erro ao carregar PDF.js:', error);
            throw new Error('Não foi possível carregar a biblioteca PDF.js');
        }
    }

    /**
     * Carrega PDF.js do CDN
     */
    async loadPDFJSFromCDN() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Processa arquivo PDF
     */
    async process(file, options = {}) {
        try {
            const pdfLib = await this.loadPDFLib();
            
            // Converte arquivo para ArrayBuffer
            const arrayBuffer = await this.fileToArrayBuffer(file);
            
            // Carrega documento PDF
            const pdf = await pdfLib.getDocument({ data: arrayBuffer }).promise;
            
            // Extrai texto de todas as páginas
            const textContent = await this.extractTextFromPDF(pdf, options);
            
            // Converte texto para HTML
            const htmlContent = this.convertTextToHTML(textContent, options);
            
            // Extrai metadados
            const metadata = await this.extractMetadata(pdf);
            
            return {
                content: htmlContent,
                metadata: {
                    originalFormat: 'application/pdf',
                    pages: pdf.numPages,
                    ...metadata
                },
                title: metadata.title || 'Documento PDF'
            };
            
        } catch (error) {
            console.error('Erro ao processar arquivo PDF:', error);
            throw new Error(`Erro ao processar arquivo PDF: ${error.message}`);
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
                reject(new Error('Erro ao ler arquivo PDF'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Extrai texto de todas as páginas do PDF
     */
    async extractTextFromPDF(pdf, options = {}) {
        const textContent = [];
        const maxPages = options.maxPages || pdf.numPages;
        
        for (let pageNum = 1; pageNum <= Math.min(maxPages, pdf.numPages); pageNum++) {
            try {
                const page = await pdf.getPage(pageNum);
                const textContentObj = await page.getTextContent();
                
                // Extrai texto da página
                const pageText = textContentObj.items
                    .map(item => item.str)
                    .join(' ')
                    .trim();
                
                if (pageText) {
                    textContent.push({
                        page: pageNum,
                        text: pageText
                    });
                }
                
            } catch (error) {
                console.error(`Erro ao extrair texto da página ${pageNum}:`, error);
                textContent.push({
                    page: pageNum,
                    text: `[Erro ao extrair texto da página ${pageNum}]`
                });
            }
        }
        
        return textContent;
    }

    /**
     * Converte texto extraído para HTML
     */
    convertTextToHTML(textContent, options = {}) {
        if (!textContent || textContent.length === 0) {
            return '<p>Não foi possível extrair texto do PDF</p>';
        }
        
        let html = '';
        
        if (options.preservePages !== false) {
            // Mantém separação por páginas
            textContent.forEach(pageContent => {
                html += `<h3>Página ${pageContent.page}</h3>\n`;
                html += this.formatTextAsHTML(pageContent.text);
                html += '\n\n';
            });
        } else {
            // Concatena todo o texto
            const allText = textContent.map(page => page.text).join(' ');
            html = this.formatTextAsHTML(allText);
        }
        
        return html;
    }

    /**
     * Formata texto como HTML
     */
    formatTextAsHTML(text) {
        // Limpa e processa o texto
        const cleanText = text
            .replace(/\s+/g, ' ')  // Normaliza espaços
            .trim();
        
        // Divide em parágrafos (tenta detectar quebras naturais)
        const paragraphs = this.splitIntoParagraphs(cleanText);
        
        return paragraphs
            .map(paragraph => `<p>${this.escapeHTML(paragraph)}</p>`)
            .join('\n');
    }

    /**
     * Divide texto em parágrafos
     */
    splitIntoParagraphs(text) {
        // Tenta dividir em parágrafos baseado em padrões comuns
        const sentences = text.split(/[.!?]+\s+/);
        const paragraphs = [];
        let currentParagraph = '';
        
        sentences.forEach(sentence => {
            currentParagraph += sentence.trim() + '. ';
            
            // Se a sentença parece ser o fim de um parágrafo
            if (currentParagraph.length > 200 || this.looksLikeParagraphEnd(sentence)) {
                paragraphs.push(currentParagraph.trim());
                currentParagraph = '';
            }
        });
        
        // Adiciona último parágrafo se houver
        if (currentParagraph.trim()) {
            paragraphs.push(currentParagraph.trim());
        }
        
        return paragraphs.filter(p => p.length > 0);
    }

    /**
     * Verifica se parece fim de parágrafo
     */
    looksLikeParagraphEnd(sentence) {
        // Heurísticas simples para detectar fim de parágrafo
        const indicators = [
            /\d+\.\s*$/,  // Termina com número e ponto
            /^[A-Z][a-z]+:/,  // Começa com palavra seguida de dois pontos
            /\b(portanto|assim|enfim|concluindo)\b/i  // Palavras de conclusão
        ];
        
        return indicators.some(regex => regex.test(sentence));
    }

    /**
     * Escapa HTML
     */
    escapeHTML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Extrai metadados do PDF
     */
    async extractMetadata(pdf) {
        const metadata = {};
        
        try {
            const pdfMetadata = await pdf.getMetadata();
            
            if (pdfMetadata.info) {
                metadata.title = pdfMetadata.info.Title || null;
                metadata.author = pdfMetadata.info.Author || null;
                metadata.subject = pdfMetadata.info.Subject || null;
                metadata.keywords = pdfMetadata.info.Keywords || null;
                metadata.creator = pdfMetadata.info.Creator || null;
                metadata.producer = pdfMetadata.info.Producer || null;
                metadata.creationDate = pdfMetadata.info.CreationDate || null;
                metadata.modificationDate = pdfMetadata.info.ModDate || null;
            }
            
            if (pdfMetadata.metadata) {
                // Metadados XMP se disponíveis
                metadata.xmp = pdfMetadata.metadata.toString();
            }
            
        } catch (error) {
            console.error('Erro ao extrair metadados PDF:', error);
        }
        
        return metadata;
    }

    /**
     * Pré-visualização do arquivo
     */
    async preview(file, maxLength = 500) {
        try {
            const pdfLib = await this.loadPDFLib();
            const arrayBuffer = await this.fileToArrayBuffer(file);
            const pdf = await pdfLib.getDocument({ data: arrayBuffer }).promise;
            
            // Extrai texto apenas da primeira página para preview
            const firstPage = await pdf.getPage(1);
            const textContent = await firstPage.getTextContent();
            const text = textContent.items.map(item => item.str).join(' ');
            
            const preview = text.length > maxLength ? 
                text.substring(0, maxLength) + '...' : text;
            
            const metadata = await this.extractMetadata(pdf);
            
            return {
                preview,
                stats: {
                    pages: pdf.numPages,
                    title: metadata.title,
                    author: metadata.author,
                    subject: metadata.subject
                }
            };
            
        } catch (error) {
            throw new Error(`Erro ao gerar preview: ${error.message}`);
        }
    }

    /**
     * Verifica se PDF.js está disponível
     */
    static async isAvailable() {
        try {
            const processor = new PDFProcessor();
            await processor.loadPDFLib();
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default PDFProcessor;
