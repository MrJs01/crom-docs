/**
 * RTFProcessor - Processa arquivos RTF (Rich Text Format)
 */
class RTFProcessor {
    constructor() {
        this.name = 'RTFProcessor';
        this.supportedTypes = ['application/rtf', 'text/rtf', 'rtf'];
    }

    /**
     * Processa arquivo RTF
     */
    async process(file, options = {}) {
        try {
            // Lê o conteúdo do arquivo
            const rtfContent = await this.readFileAsText(file);
            
            // Converte RTF para texto/HTML
            const htmlContent = this.convertRTFToHTML(rtfContent, options);
            
            // Extrai metadados
            const metadata = this.extractMetadata(rtfContent);
            
            return {
                content: htmlContent,
                metadata: {
                    originalFormat: 'application/rtf',
                    ...metadata
                },
                title: metadata.title || 'Documento RTF'
            };
            
        } catch (error) {
            console.error('Erro ao processar arquivo RTF:', error);
            throw new Error(`Erro ao processar arquivo RTF: ${error.message}`);
        }
    }

    /**
     * Lê arquivo como texto
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = (e) => {
                reject(new Error('Erro ao ler arquivo RTF'));
            };
            
            reader.readAsText(file, 'utf-8');
        });
    }

    /**
     * Converte RTF para HTML (implementação básica)
     */
    convertRTFToHTML(rtfContent, options = {}) {
        try {
            // Esta é uma implementação básica que extrai texto do RTF
            // Para uma implementação completa, seria necessário um parser RTF mais robusto
            
            // Remove cabeçalho RTF
            let content = rtfContent.replace(/^\{\\rtf1[^}]*\}/, '');
            
            // Remove comandos RTF básicos
            content = this.removeRTFCommands(content);
            
            // Processa formatação básica
            content = this.processBasicFormatting(content);
            
            // Converte para HTML
            const htmlContent = this.convertTextToHTML(content, options);
            
            return htmlContent;
            
        } catch (error) {
            console.error('Erro ao converter RTF:', error);
            throw new Error(`Erro na conversão RTF: ${error.message}`);
        }
    }

    /**
     * Remove comandos RTF básicos
     */
    removeRTFCommands(content) {
        // Remove comandos de controle RTF
        content = content.replace(/\{\\\*[^}]*\}/g, ''); // Remove comandos de controle
        content = content.replace(/\\[a-zA-Z]+\d*\s?/g, ''); // Remove comandos formatação
        content = content.replace(/\{|\}/g, ''); // Remove chaves
        content = content.replace(/\\\\/g, '\\'); // Escapar barras
        content = content.replace(/\\'/g, "'"); // Escapar aspas
        
        return content;
    }

    /**
     * Processa formatação básica
     */
    processBasicFormatting(content) {
        // Esta implementação é muito básica
        // Uma implementação completa precisaria de um parser RTF apropriado
        
        // Remove caracteres de controle restantes
        content = content.replace(/\\[a-zA-Z]+\d*/g, '');
        content = content.replace(/\{|\}/g, '');
        
        // Normaliza espaços
        content = content.replace(/\s+/g, ' ');
        
        return content.trim();
    }

    /**
     * Converte texto para HTML
     */
    convertTextToHTML(text, options = {}) {
        if (!text || text.trim() === '') {
            return '<p>Documento RTF vazio</p>';
        }

        // Escapa caracteres HTML
        text = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        // Converte quebras de linha para parágrafos
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        
        if (paragraphs.length === 0) {
            return '<p>Documento RTF vazio</p>';
        }

        const html = paragraphs.map(paragraph => {
            const cleanParagraph = paragraph.replace(/\n/g, ' ').trim();
            return cleanParagraph ? `<p>${cleanParagraph}</p>` : '';
        }).filter(p => p).join('\n');

        return html || '<p>Documento RTF vazio</p>';
    }

    /**
     * Extrai metadados
     */
    extractMetadata(rtfContent) {
        const metadata = {};
        
        try {
            // Extrai informações básicas do cabeçalho RTF
            const titleMatch = rtfContent.match(/\\title\s+([^\\}]+)/i);
            if (titleMatch) {
                metadata.title = titleMatch[1].trim();
            }

            const authorMatch = rtfContent.match(/\\author\s+([^\\}]+)/i);
            if (authorMatch) {
                metadata.author = authorMatch[1].trim();
            }

            const subjectMatch = rtfContent.match(/\\subject\s+([^\\}]+)/i);
            if (subjectMatch) {
                metadata.subject = subjectMatch[1].trim();
            }

            const createdMatch = rtfContent.match(/\\creatim\\yr(\d{4})\\mo(\d{1,2})\\dy(\d{1,2})/);
            if (createdMatch) {
                metadata.creationDate = `${createdMatch[1]}-${createdMatch[2].padStart(2, '0')}-${createdMatch[3].padStart(2, '0')}`;
            }

            // Conta caracteres aproximados
            const plainText = this.removeRTFCommands(rtfContent);
            metadata.characters = plainText.length;
            metadata.words = plainText.split(/\s+/).filter(word => word.length > 0).length;
            
        } catch (error) {
            console.error('Erro ao extrair metadados RTF:', error);
        }
        
        return metadata;
    }

    /**
     * Pré-visualização do arquivo
     */
    async preview(file, maxLength = 500) {
        try {
            const rtfContent = await this.readFileAsText(file);
            const plainText = this.removeRTFCommands(rtfContent);
            
            const preview = plainText.length > maxLength ? 
                plainText.substring(0, maxLength) + '...' : plainText;
            
            const metadata = this.extractMetadata(rtfContent);
            
            return {
                preview,
                stats: {
                    title: metadata.title,
                    author: metadata.author,
                    subject: metadata.subject,
                    characters: metadata.characters,
                    words: metadata.words
                }
            };
            
        } catch (error) {
            throw new Error(`Erro ao gerar preview: ${error.message}`);
        }
    }

    /**
     * Extrai texto puro
     */
    async extractText(file) {
        try {
            const rtfContent = await this.readFileAsText(file);
            return this.removeRTFCommands(rtfContent);
            
        } catch (error) {
            throw new Error(`Erro ao extrair texto: ${error.message}`);
        }
    }

    /**
     * Verifica se RTF é suportado
     */
    static isAvailable() {
        return true; // Implementação básica sempre disponível
    }

    /**
     * Informações sobre limitações
     */
    static getLimitations() {
        return [
            'Implementação básica - formatação complexa pode ser perdida',
            'Imagens incorporadas não são suportadas',
            'Tabelas podem não ser processadas corretamente',
            'Recomenda-se usar Word para arquivos RTF complexos'
        ];
    }
}

export default RTFProcessor;
