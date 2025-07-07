/**
 * exportUtils - Utilitários para conversão e formatação de documentos
 */

export const exportUtils = {
    /**
     * Converte HTML para texto simples
     */
    htmlToText(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    },

    /**
     * Converte HTML para Markdown
     */
    htmlToMarkdown(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return this.convertElementToMarkdown(tempDiv);
    },

    /**
     * Converte um elemento DOM para Markdown
     */
    convertElementToMarkdown(element) {
        let result = '';
        
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                
                switch (tagName) {
                    case 'h1':
                        result += `# ${node.textContent}\n\n`;
                        break;
                    case 'h2':
                        result += `## ${node.textContent}\n\n`;
                        break;
                    case 'h3':
                        result += `### ${node.textContent}\n\n`;
                        break;
                    case 'h4':
                        result += `#### ${node.textContent}\n\n`;
                        break;
                    case 'h5':
                        result += `##### ${node.textContent}\n\n`;
                        break;
                    case 'h6':
                        result += `###### ${node.textContent}\n\n`;
                        break;
                    case 'p':
                        result += `${this.convertElementToMarkdown(node)}\n\n`;
                        break;
                    case 'strong':
                    case 'b':
                        result += `**${node.textContent}**`;
                        break;
                    case 'em':
                    case 'i':
                        result += `*${node.textContent}*`;
                        break;
                    case 'u':
                        result += `<u>${node.textContent}</u>`;
                        break;
                    case 'del':
                    case 's':
                        result += `~~${node.textContent}~~`;
                        break;
                    case 'a':
                        result += `[${node.textContent}](${node.href || '#'})`;
                        break;
                    case 'ul':
                        for (let li of node.querySelectorAll('li')) {
                            result += `- ${li.textContent}\n`;
                        }
                        result += '\n';
                        break;
                    case 'ol':
                        let index = 1;
                        for (let li of node.querySelectorAll('li')) {
                            result += `${index}. ${li.textContent}\n`;
                            index++;
                        }
                        result += '\n';
                        break;
                    case 'blockquote':
                        const lines = node.textContent.split('\n');
                        for (let line of lines) {
                            if (line.trim()) {
                                result += `> ${line}\n`;
                            }
                        }
                        result += '\n';
                        break;
                    case 'code':
                        result += `\`${node.textContent}\``;
                        break;
                    case 'pre':
                        result += `\`\`\`\n${node.textContent}\n\`\`\`\n\n`;
                        break;
                    case 'hr':
                        result += `---\n\n`;
                        break;
                    case 'br':
                        result += '\n';
                        break;
                    default:
                        result += this.convertElementToMarkdown(node);
                }
            }
        }
        
        return result;
    },

    /**
     * Limpa o HTML removendo scripts e estilos inline perigosos
     */
    sanitizeHtml(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Remover scripts
        const scripts = tempDiv.querySelectorAll('script');
        scripts.forEach(script => script.remove());
        
        // Remover estilos inline perigosos
        const elementsWithStyle = tempDiv.querySelectorAll('[style]');
        elementsWithStyle.forEach(element => {
            const style = element.getAttribute('style');
            if (style) {
                // Remover JavaScript de estilos
                const cleanStyle = style.replace(/javascript:/gi, '');
                element.setAttribute('style', cleanStyle);
            }
        });
        
        return tempDiv.innerHTML;
    },

    /**
     * Gera HTML limpo para exportação
     */
    generateCleanHtml(content, title, options = {}) {
        const {
            includeStyles = true,
            includeMetadata = true,
            customStyles = ''
        } = options;
        
        const cleanContent = this.sanitizeHtml(content);
        const date = new Date().toLocaleDateString('pt-BR');
        const time = new Date().toLocaleTimeString('pt-BR');
        
        let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>`;
        
        if (includeStyles) {
            html += `
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem; 
        }
        h1, h2, h3, h4, h5, h6 { 
            color: #2c3e50; 
            margin-top: 2rem; 
            margin-bottom: 1rem; 
        }
        h1 { font-size: 2.5rem; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.75rem; }
        h4 { font-size: 1.5rem; }
        h5 { font-size: 1.25rem; }
        h6 { font-size: 1rem; }
        p { margin-bottom: 1rem; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
        blockquote { 
            border-left: 4px solid #3498db; 
            padding-left: 1rem; 
            margin-left: 0; 
            color: #666; 
        }
        code { 
            background: #f4f4f4; 
            padding: 2px 4px; 
            border-radius: 3px; 
            font-family: 'Courier New', monospace; 
        }
        pre { 
            background: #f4f4f4; 
            padding: 1rem; 
            border-radius: 4px; 
            overflow-x: auto; 
            font-family: 'Courier New', monospace; 
        }
        ul, ol { margin-bottom: 1rem; }
        li { margin-bottom: 0.5rem; }
        hr { 
            border: none; 
            border-top: 1px solid #ddd; 
            margin: 2rem 0; 
        }
        .header { 
            border-bottom: 2px solid #3498db; 
            padding-bottom: 1rem; 
            margin-bottom: 2rem; 
        }
        .footer { 
            border-top: 1px solid #ddd; 
            padding-top: 1rem; 
            margin-top: 2rem; 
            font-size: 0.9em; 
            color: #666; 
        }
        ${customStyles}
    </style>`;
        }
        
        html += `
</head>
<body>`;
        
        if (includeMetadata) {
            html += `
    <div class="header">
        <h1>${title}</h1>
        <p style="color: #666; font-style: italic;">Exportado do CROM Docs em ${date} às ${time}</p>
    </div>`;
        }
        
        html += `
    <div class="content">
        ${cleanContent}
    </div>`;
        
        if (includeMetadata) {
            html += `
    <div class="footer">
        <p>Este documento foi criado usando CROM Docs - Editor de documentos privado e seguro.</p>
        <p>Data de exportação: ${date} às ${time}</p>
    </div>`;
        }
        
        html += `
</body>
</html>`;
        
        return html;
    },

    /**
     * Conta palavras em um texto
     */
    countWords(text) {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    },

    /**
     * Conta caracteres em um texto
     */
    countCharacters(text) {
        return text ? text.length : 0;
    },

    /**
     * Extrai títulos do HTML para criar sumário
     */
    extractHeadings(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const headings = [];
        const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headingElements.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent;
            const id = `heading-${index}`;
            
            headings.push({
                level,
                text,
                id
            });
        });
        
        return headings;
    },

    /**
     * Gera sumário baseado nos títulos
     */
    generateTableOfContents(headings) {
        if (!headings || headings.length === 0) {
            return '';
        }
        
        let toc = '<div class="table-of-contents">\n<h2>Sumário</h2>\n<ul>\n';
        
        headings.forEach(heading => {
            const indent = '  '.repeat(heading.level - 1);
            toc += `${indent}<li><a href="#${heading.id}">${heading.text}</a></li>\n`;
        });
        
        toc += '</ul>\n</div>\n';
        
        return toc;
    },

    /**
     * Adiciona IDs aos títulos para navegação
     */
    addHeadingIds(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headingElements.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.setAttribute('id', id);
        });
        
        return tempDiv.innerHTML;
    },

    /**
     * Valida se o conteúdo é HTML válido
     */
    isValidHtml(html) {
        try {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            return true;
        } catch (error) {
            return false;
        }
    },

    /**
     * Formata tamanho de arquivo em bytes para formato legível
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Cria um nome de arquivo seguro
     */
    sanitizeFileName(fileName) {
        return fileName
            .replace(/[^a-zA-Z0-9\-_\s]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 100);
    },

    /**
     * Detecta o tipo de conteúdo
     */
    detectContentType(content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        const hasHeadings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
        const hasLists = tempDiv.querySelectorAll('ul, ol').length > 0;
        const hasLinks = tempDiv.querySelectorAll('a').length > 0;
        const hasFormatting = tempDiv.querySelectorAll('strong, em, b, i').length > 0;
        
        const wordCount = this.countWords(tempDiv.textContent);
        
        let type = 'simple';
        
        if (wordCount > 1000) {
            type = 'long-form';
        } else if (hasHeadings && hasLists) {
            type = 'structured';
        } else if (hasFormatting || hasLinks) {
            type = 'formatted';
        }
        
        return {
            type,
            hasHeadings,
            hasLists,
            hasLinks,
            hasFormatting,
            wordCount
        };
    }
};

export default exportUtils;
