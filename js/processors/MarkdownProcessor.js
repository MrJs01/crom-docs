/**
 * MarkdownProcessor - Processa arquivos Markdown usando marked.js
 */
class MarkdownProcessor {
    constructor() {
        this.name = 'MarkdownProcessor';
        this.supportedTypes = ['text/markdown', 'text/x-markdown', 'md'];
        this.marked = null;
    }

    /**
     * Carrega a biblioteca marked.js
     */
    async loadMarkedLib() {
        if (this.marked) {
            return this.marked;
        }

        try {
            // Tenta carregar marked.js via CDN
            if (typeof marked === 'undefined') {
                await this.loadMarkedFromCDN();
            }
            
            this.marked = marked;
            
            // Configura o marked
            this.configureMarked();
            
            return this.marked;
            
        } catch (error) {
            console.error('Erro ao carregar marked.js:', error);
            throw new Error('Não foi possível carregar a biblioteca marked.js');
        }
    }

    /**
     * Carrega marked.js do CDN
     */
    async loadMarkedFromCDN() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Configura o marked
     */
    configureMarked() {
        if (this.marked && this.marked.setOptions) {
            this.marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false,
                sanitize: false,
                silent: false,
                smartypants: true,
                xhtml: false
            });
        }
    }

    /**
     * Processa arquivo Markdown
     */
    async process(file, options = {}) {
        try {
            const markedLib = await this.loadMarkedLib();
            
            // Lê o conteúdo do arquivo
            const markdownContent = await this.readFileAsText(file);
            
            // Converte Markdown para HTML
            const htmlContent = await this.convertMarkdownToHTML(markdownContent, options);
            
            // Extrai metadados
            const metadata = this.extractMetadata(markdownContent, htmlContent);
            
            return {
                content: htmlContent,
                metadata: {
                    originalFormat: 'text/markdown',
                    ...metadata
                },
                title: metadata.title || 'Documento Markdown'
            };
            
        } catch (error) {
            console.error('Erro ao processar arquivo Markdown:', error);
            throw new Error(`Erro ao processar arquivo Markdown: ${error.message}`);
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
                reject(new Error('Erro ao ler arquivo Markdown'));
            };
            
            reader.readAsText(file, 'utf-8');
        });
    }

    /**
     * Converte Markdown para HTML
     */
    async convertMarkdownToHTML(markdown, options = {}) {
        try {
            // Processa front matter se presente
            const { content, frontMatter } = this.parseFrontMatter(markdown);
            
            // Converte para HTML
            let html = await this.marked.parse(content);
            
            // Pós-processa HTML
            html = this.postProcessHTML(html, options);
            
            // Armazena front matter para uso posterior
            this.lastFrontMatter = frontMatter;
            
            return html;
            
        } catch (error) {
            console.error('Erro ao converter Markdown:', error);
            throw new Error(`Erro na conversão Markdown: ${error.message}`);
        }
    }

    /**
     * Analisa front matter (metadados no início do arquivo)
     */
    parseFrontMatter(markdown) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = markdown.match(frontMatterRegex);
        
        if (match) {
            const frontMatterText = match[1];
            const content = markdown.substring(match[0].length);
            
            // Parse YAML simples
            const frontMatter = this.parseYAML(frontMatterText);
            
            return { content, frontMatter };
        }
        
        return { content: markdown, frontMatter: {} };
    }

    /**
     * Parser YAML simples
     */
    parseYAML(yamlText) {
        const result = {};
        const lines = yamlText.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const colonIndex = trimmed.indexOf(':');
                if (colonIndex > 0) {
                    const key = trimmed.substring(0, colonIndex).trim();
                    const value = trimmed.substring(colonIndex + 1).trim();
                    
                    // Remove aspas se presentes
                    const cleanValue = value.replace(/^["']|["']$/g, '');
                    
                    result[key] = cleanValue;
                }
            }
        });
        
        return result;
    }

    /**
     * Pós-processa HTML
     */
    postProcessHTML(html, options = {}) {
        // Adiciona classes CSS para melhor estilização
        html = this.addBootstrapClasses(html);
        
        // Processa links externos
        if (options.processExternalLinks !== false) {
            html = this.processExternalLinks(html);
        }
        
        // Processa imagens
        if (options.processImages !== false) {
            html = this.processImages(html);
        }
        
        // Processa código
        html = this.processCodeBlocks(html);
        
        return html;
    }

    /**
     * Adiciona classes Bootstrap
     */
    addBootstrapClasses(html) {
        // Adiciona classes para tabelas
        html = html.replace(/<table>/g, '<table class="table table-dark table-striped">');
        
        // Adiciona classes para imagens
        html = html.replace(/<img([^>]*)>/g, '<img$1 class="img-fluid">');
        
        // Adiciona classes para blockquotes
        html = html.replace(/<blockquote>/g, '<blockquote class="blockquote">');
        
        return html;
    }

    /**
     * Processa links externos
     */
    processExternalLinks(html) {
        return html.replace(/<a\s+href="(https?:\/\/[^"]*)"([^>]*)>/g, '<a href="$1"$2 target="_blank" rel="noopener noreferrer">');
    }

    /**
     * Processa imagens
     */
    processImages(html) {
        // Adiciona suporte a imagens com título
        html = html.replace(/<img([^>]*)\salt="([^"]*)"([^>]*)>/g, '<figure><img$1 alt="$2"$3><figcaption class="figure-caption">$2</figcaption></figure>');
        
        return html;
    }

    /**
     * Processa blocos de código
     */
    processCodeBlocks(html) {
        // Adiciona classes para syntax highlighting
        html = html.replace(/<pre><code class="language-([^"]*)">/g, '<pre><code class="language-$1 hljs">');
        
        return html;
    }

    /**
     * Extrai metadados
     */
    extractMetadata(markdown, html) {
        const metadata = {};
        
        // Metadados do front matter
        if (this.lastFrontMatter) {
            metadata.frontMatter = this.lastFrontMatter;
            metadata.title = this.lastFrontMatter.title;
            metadata.author = this.lastFrontMatter.author;
            metadata.date = this.lastFrontMatter.date;
            metadata.tags = this.lastFrontMatter.tags;
            metadata.description = this.lastFrontMatter.description;
        }
        
        // Extrai título se não estiver no front matter
        if (!metadata.title) {
            const titleMatch = markdown.match(/^#\s+(.+)$/m);
            if (titleMatch) {
                metadata.title = titleMatch[1].trim();
            }
        }
        
        // Conta elementos
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
        metadata.links = (html.match(/<a[^>]*>/gi) || []).length;
        metadata.codeBlocks = (html.match(/<pre><code/gi) || []).length;
        metadata.tables = (html.match(/<table[^>]*>/gi) || []).length;
        metadata.lists = (html.match(/<[ou]l[^>]*>/gi) || []).length;
        
        // Conta caracteres e palavras
        const plainText = this.stripHTML(html);
        metadata.characters = plainText.length;
        metadata.words = plainText.split(/\s+/).filter(word => word.length > 0).length;
        
        // Detecta características especiais do Markdown
        metadata.hasFrontMatter = !!this.lastFrontMatter && Object.keys(this.lastFrontMatter).length > 0;
        metadata.hasCodeBlocks = metadata.codeBlocks > 0;
        metadata.hasTables = metadata.tables > 0;
        metadata.hasImages = metadata.images > 0;
        
        return metadata;
    }

    /**
     * Remove tags HTML
     */
    stripHTML(html) {
        return html.replace(/<[^>]*>/g, '').trim();
    }

    /**
     * Pré-visualização do arquivo
     */
    async preview(file, maxLength = 500) {
        try {
            const markdown = await this.readFileAsText(file);
            const { content, frontMatter } = this.parseFrontMatter(markdown);
            
            // Converte uma parte do markdown para preview
            const previewMarkdown = content.length > maxLength * 2 ? 
                content.substring(0, maxLength * 2) + '...' : content;
            
            const markedLib = await this.loadMarkedLib();
            const html = await markedLib.parse(previewMarkdown);
            const plainText = this.stripHTML(html);
            
            const preview = plainText.length > maxLength ? 
                plainText.substring(0, maxLength) + '...' : plainText;
            
            return {
                preview,
                stats: {
                    title: frontMatter.title,
                    author: frontMatter.author,
                    hasFrontMatter: Object.keys(frontMatter).length > 0,
                    characters: content.length,
                    words: content.split(/\s+/).filter(word => word.length > 0).length,
                    headings: (content.match(/^#+\s/gm) || []).length
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
            const markdown = await this.readFileAsText(file);
            const { content } = this.parseFrontMatter(markdown);
            
            // Remove sintaxe Markdown básica
            return content
                .replace(/^#+\s*/gm, '')  // Remove headers
                .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
                .replace(/\*(.*?)\*/g, '$1')  // Remove italic
                .replace(/`(.*?)`/g, '$1')  // Remove inline code
                .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')  // Remove links
                .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')  // Remove images
                .trim();
            
        } catch (error) {
            throw new Error(`Erro ao extrair texto: ${error.message}`);
        }
    }

    /**
     * Verifica se marked.js está disponível
     */
    static async isAvailable() {
        try {
            const processor = new MarkdownProcessor();
            await processor.loadMarkedLib();
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default MarkdownProcessor;
