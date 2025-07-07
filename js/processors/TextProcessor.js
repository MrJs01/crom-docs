/**
 * TextProcessor - Processa arquivos de texto simples
 */
class TextProcessor {
    constructor() {
        this.name = 'TextProcessor';
        this.supportedTypes = ['text/plain', 'txt'];
    }

    /**
     * Processa arquivo de texto
     */
    async process(file, options = {}) {
        try {
            const text = await this.readFileAsText(file);
            
            // Detecta quebras de linha e converte para HTML
            const htmlContent = this.convertTextToHTML(text, options);
            
            return {
                content: htmlContent,
                metadata: {
                    originalFormat: 'text/plain',
                    encoding: options.encoding || 'utf-8',
                    lineCount: text.split('\n').length,
                    characterCount: text.length
                },
                title: this.extractTitleFromContent(text) || 'Documento de Texto'
            };
            
        } catch (error) {
            console.error('Erro ao processar arquivo de texto:', error);
            throw new Error(`Erro ao processar arquivo de texto: ${error.message}`);
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
                reject(new Error('Erro ao ler arquivo'));
            };
            
            reader.readAsText(file, 'utf-8');
        });
    }

    /**
     * Converte texto simples para HTML
     */
    convertTextToHTML(text, options = {}) {
        // Escapa caracteres HTML
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        // Converte quebras de linha para parágrafos
        if (options.preserveLineBreaks !== false) {
            // Divide em parágrafos (linhas vazias)
            const paragraphs = html.split(/\n\s*\n/);
            
            html = paragraphs.map(paragraph => {
                // Remove quebras de linha simples dentro do parágrafo
                const cleanParagraph = paragraph.replace(/\n/g, ' ').trim();
                
                if (cleanParagraph) {
                    // Detecta se parece com um título (linha curta, talvez em maiúsculas)
                    if (this.looksLikeTitle(cleanParagraph)) {
                        return `<h2>${cleanParagraph}</h2>`;
                    }
                    return `<p>${cleanParagraph}</p>`;
                }
                return '';
            }).filter(p => p).join('\n');
        } else {
            // Apenas converte quebras de linha simples
            html = html.replace(/\n/g, '<br>');
            html = `<p>${html}</p>`;
        }

        return html || '<p>Documento vazio</p>';
    }

    /**
     * Verifica se uma linha parece com um título
     */
    looksLikeTitle(line) {
        // Critérios para detectar títulos:
        // - Linha curta (menos de 80 caracteres)
        // - Não termina com ponto
        // - Pode estar em maiúsculas
        // - Pode ter caracteres especiais como underscores
        
        const trimmed = line.trim();
        
        if (trimmed.length === 0 || trimmed.length > 80) {
            return false;
        }
        
        // Não termina com ponto
        if (trimmed.endsWith('.') || trimmed.endsWith('!') || trimmed.endsWith('?')) {
            return false;
        }
        
        // Verifica se está em maiúsculas ou tem padrão de título
        const isAllCaps = trimmed === trimmed.toUpperCase();
        const hasUnderscores = trimmed.includes('_') || trimmed.includes('-');
        const isShort = trimmed.length <= 50;
        
        return isAllCaps || hasUnderscores || isShort;
    }

    /**
     * Extrai título do conteúdo
     */
    extractTitleFromContent(text) {
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
            return null;
        }
        
        // Pega a primeira linha não vazia
        const firstLine = lines[0].trim();
        
        // Se a primeira linha parece um título, usa ela
        if (this.looksLikeTitle(firstLine)) {
            return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
        }
        
        // Senão, pega os primeiros 50 caracteres
        return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
    }

    /**
     * Pré-visualização do arquivo
     */
    async preview(file, maxLength = 500) {
        try {
            const text = await this.readFileAsText(file);
            const preview = text.length > maxLength ? 
                text.substring(0, maxLength) + '...' : text;
            
            return {
                preview,
                stats: {
                    lines: text.split('\n').length,
                    characters: text.length,
                    words: text.split(/\s+/).filter(word => word.length > 0).length
                }
            };
        } catch (error) {
            throw new Error(`Erro ao gerar preview: ${error.message}`);
        }
    }
}

export default TextProcessor;
