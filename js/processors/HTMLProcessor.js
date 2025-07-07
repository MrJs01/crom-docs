/**
 * HTMLProcessor - Processa arquivos HTML
 */
class HTMLProcessor {
    constructor() {
        this.name = 'HTMLProcessor';
        this.supportedTypes = ['text/html', 'html'];
    }

    /**
     * Processa arquivo HTML
     */
    async process(file, options = {}) {
        try {
            const htmlContent = await this.readFileAsText(file);
            
            // Limpa e sanitiza o HTML
            const cleanedHTML = this.cleanHTML(htmlContent, options);
            
            // Extrai metadados
            const metadata = this.extractMetadata(htmlContent);
            
            return {
                content: cleanedHTML,
                metadata: {
                    originalFormat: 'text/html',
                    ...metadata
                },
                title: metadata.title || 'Documento HTML'
            };
            
        } catch (error) {
            console.error('Erro ao processar arquivo HTML:', error);
            throw new Error(`Erro ao processar arquivo HTML: ${error.message}`);
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
     * Limpa e sanitiza HTML
     */
    cleanHTML(html, options = {}) {
        try {
            // Cria um parser DOM
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Remove elementos indesejados
            this.removeUnwantedElements(doc);
            
            // Limpa atributos inseguros
            this.cleanAttributes(doc);
            
            // Extrai apenas o conteúdo do body ou todo o documento
            let cleanedContent;
            
            if (options.extractBodyOnly !== false) {
                const body = doc.body;
                cleanedContent = body ? body.innerHTML : doc.documentElement.innerHTML;
            } else {
                cleanedContent = doc.documentElement.innerHTML;
            }
            
            // Remove scripts e estilos inline se solicitado
            if (options.removeScripts !== false) {
                cleanedContent = this.removeScriptsAndStyles(cleanedContent);
            }
            
            return cleanedContent || '<p>Documento HTML vazio</p>';
            
        } catch (error) {
            console.error('Erro ao limpar HTML:', error);
            // Fallback: retorna HTML original com tags perigosas removidas
            return this.basicHTMLSanitization(html);
        }
    }

    /**
     * Remove elementos indesejados
     */
    removeUnwantedElements(doc) {
        const unwantedTags = [
            'script', 'style', 'meta', 'link', 'title', 'head',
            'iframe', 'object', 'embed', 'applet', 'form',
            'input', 'button', 'select', 'textarea'
        ];
        
        unwantedTags.forEach(tag => {
            const elements = doc.getElementsByTagName(tag);
            // Converte para array para evitar problemas com live collections
            Array.from(elements).forEach(el => el.remove());
        });
    }

    /**
     * Limpa atributos perigosos
     */
    cleanAttributes(doc) {
        const dangerousAttributes = [
            'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
            'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
            'javascript:', 'vbscript:', 'data:'
        ];
        
        const allElements = doc.getElementsByTagName('*');
        
        Array.from(allElements).forEach(element => {
            // Remove atributos perigosos
            dangerousAttributes.forEach(attr => {
                if (element.hasAttribute(attr)) {
                    element.removeAttribute(attr);
                }
            });
            
            // Limpa atributos href e src suspeitos
            ['href', 'src'].forEach(attr => {
                if (element.hasAttribute(attr)) {
                    const value = element.getAttribute(attr);
                    if (value && (value.startsWith('javascript:') || value.startsWith('vbscript:'))) {
                        element.removeAttribute(attr);
                    }
                }
            });
        });
    }

    /**
     * Remove scripts e estilos inline
     */
    removeScriptsAndStyles(html) {
        return html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/on\w+='[^']*'/gi, '')
            .replace(/javascript:[^"']*/gi, '');
    }

    /**
     * Sanitização básica de HTML
     */
    basicHTMLSanitization(html) {
        return html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
            .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
            .replace(/<embed[^>]*>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/javascript:[^"']*/gi, '');
    }

    /**
     * Extrai metadados do HTML
     */
    extractMetadata(html) {
        const metadata = {};
        
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extrai título
            const titleElement = doc.querySelector('title');
            if (titleElement) {
                metadata.title = titleElement.textContent.trim();
            }
            
            // Extrai meta description
            const descriptionMeta = doc.querySelector('meta[name="description"]');
            if (descriptionMeta) {
                metadata.description = descriptionMeta.getAttribute('content');
            }
            
            // Extrai meta keywords
            const keywordsMeta = doc.querySelector('meta[name="keywords"]');
            if (keywordsMeta) {
                metadata.keywords = keywordsMeta.getAttribute('content').split(',').map(k => k.trim());
            }
            
            // Extrai meta author
            const authorMeta = doc.querySelector('meta[name="author"]');
            if (authorMeta) {
                metadata.author = authorMeta.getAttribute('content');
            }
            
            // Conta elementos
            metadata.headings = {
                h1: doc.querySelectorAll('h1').length,
                h2: doc.querySelectorAll('h2').length,
                h3: doc.querySelectorAll('h3').length,
                h4: doc.querySelectorAll('h4').length,
                h5: doc.querySelectorAll('h5').length,
                h6: doc.querySelectorAll('h6').length
            };
            
            metadata.paragraphs = doc.querySelectorAll('p').length;
            metadata.images = doc.querySelectorAll('img').length;
            metadata.links = doc.querySelectorAll('a').length;
            
        } catch (error) {
            console.error('Erro ao extrair metadados:', error);
        }
        
        return metadata;
    }

    /**
     * Extrai texto puro do HTML
     */
    extractPlainText(html) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.body ? doc.body.textContent : doc.textContent;
        } catch (error) {
            // Fallback: remove tags manualmente
            return html.replace(/<[^>]*>/g, '');
        }
    }

    /**
     * Pré-visualização do arquivo
     */
    async preview(file, maxLength = 500) {
        try {
            const html = await this.readFileAsText(file);
            const plainText = this.extractPlainText(html);
            const preview = plainText.length > maxLength ? 
                plainText.substring(0, maxLength) + '...' : plainText;
            
            const metadata = this.extractMetadata(html);
            
            return {
                preview,
                stats: {
                    title: metadata.title,
                    description: metadata.description,
                    headings: metadata.headings,
                    paragraphs: metadata.paragraphs,
                    images: metadata.images,
                    links: metadata.links
                }
            };
        } catch (error) {
            throw new Error(`Erro ao gerar preview: ${error.message}`);
        }
    }

    /**
     * Converte HTML para formato de editor
     */
    convertForEditor(html) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Remove elementos de layout que não são necessários no editor
            const unwantedElements = [
                'nav', 'footer', 'header', 'aside', 'script', 'style', 
                'meta', 'link', 'title', 'head', 'iframe', 'object', 'embed'
            ];
            
            unwantedElements.forEach(tag => {
                const elements = doc.getElementsByTagName(tag);
                Array.from(elements).forEach(el => el.remove());
            });
            
            // Limpa atributos desnecessários
            const allElements = doc.getElementsByTagName('*');
            Array.from(allElements).forEach(element => {
                // Remove atributos de estilo inline para manter formatação do editor
                const attributesToRemove = ['style', 'class', 'id', 'onclick', 'onload'];
                attributesToRemove.forEach(attr => {
                    if (element.hasAttribute(attr)) {
                        element.removeAttribute(attr);
                    }
                });
                
                // Preserva apenas atributos essenciais
                if (element.tagName === 'A' && element.hasAttribute('href')) {
                    // Mantém href para links
                } else if (element.tagName === 'IMG' && element.hasAttribute('src')) {
                    // Mantém src para imagens
                } else if (element.tagName === 'IMG' && element.hasAttribute('alt')) {
                    // Mantém alt para imagens
                }
            });
            
            // Extrai conteúdo do body ou documento
            const body = doc.body;
            let cleanedContent = '';
            
            if (body && body.innerHTML.trim()) {
                cleanedContent = body.innerHTML;
            } else {
                // Se não há body específico, pega todo o conteúdo
                cleanedContent = doc.documentElement.innerHTML;
            }
            
            // Remove tags vazias
            cleanedContent = cleanedContent.replace(/<(\w+)(\s[^>]*)?>\s*<\/\1>/g, '');
            
            // Garante que há pelo menos um parágrafo
            if (!cleanedContent.trim()) {
                cleanedContent = '<p>Documento HTML vazio</p>';
            } else if (!cleanedContent.includes('<p>') && !cleanedContent.includes('<h')) {
                // Se não há parágrafos ou títulos, envolve em parágrafo
                cleanedContent = `<p>${cleanedContent}</p>`;
            }
            
            return cleanedContent;
            
        } catch (error) {
            console.error('Erro ao converter HTML para editor:', error);
            // Fallback: sanitização básica
            return this.basicHTMLSanitization(html);
        }
    }
}

export default HTMLProcessor;
