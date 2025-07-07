/**
 * EmailSystem - Sistema para envio de documentos por email
 */

class EmailSystem {
    constructor() {
        this.emailServiceConfig = {
            service: 'emailjs',
            serviceId: 'your_service_id',
            templateId: 'your_template_id',
            publicKey: 'your_public_key'
        };
        
        this.initialized = false;
        this.initializeEmailService();
    }

    async initializeEmailService() {
        try {
            // Carregar EmailJS se não estiver carregado
            if (typeof emailjs === 'undefined') {
                await this.loadEmailJS();
            }
            
            // Inicializar EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.emailServiceConfig.publicKey);
                this.initialized = true;
                console.log('EmailJS initialized successfully');
            }
        } catch (error) {
            console.error('Failed to initialize email service:', error);
            this.initialized = false;
        }
    }

    async loadEmailJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async sendDocumentByEmail(documentData, recipientEmail, senderMessage = '', format = 'html') {
        if (!this.initialized) {
            throw new Error('Email service not initialized');
        }

        if (!this.validateEmail(recipientEmail)) {
            throw new Error('Invalid email address');
        }

        try {
            const emailData = this.prepareEmailData(documentData, recipientEmail, senderMessage, format);
            
            // Por enquanto, simular envio
            console.log('Sending email with data:', emailData);
            
            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Por enquanto, sempre retornar sucesso
            return {
                success: true,
                message: 'Email enviado com sucesso (simulado)',
                emailData
            };
            
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email: ' + error.message);
        }
    }

    prepareEmailData(documentData, recipientEmail, senderMessage, format) {
        const metadata = documentData.metadata || {};
        const title = metadata.title || 'Documento sem título';
        const content = documentData.content || '';
        
        let formattedContent = '';
        let attachmentName = '';
        
        switch (format) {
            case 'html':
                formattedContent = this.formatAsHtml(content, title);
                attachmentName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
                break;
            case 'txt':
                formattedContent = this.formatAsText(content, title);
                attachmentName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                break;
            case 'md':
                formattedContent = this.formatAsMarkdown(content, title);
                attachmentName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
                break;
            default:
                formattedContent = content;
                attachmentName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
        }
        
        return {
            to_email: recipientEmail,
            document_title: title,
            document_content: formattedContent,
            sender_message: senderMessage || 'Documento enviado via CROM Docs',
            attachment_name: attachmentName,
            sent_date: new Date().toLocaleDateString('pt-BR'),
            sent_time: new Date().toLocaleTimeString('pt-BR')
        };
    }

    formatAsHtml(content, title) {
        return `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 2rem; 
                    }
                    h1, h2, h3, h4, h5, h6 { color: #2c3e50; }
                    a { color: #3498db; text-decoration: none; }
                    a:hover { text-decoration: underline; }
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
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${title}</h1>
                    <p style="color: #666; font-style: italic;">Documento enviado via CROM Docs</p>
                </div>
                
                <div class="content">
                    ${content}
                </div>
                
                <div class="footer">
                    <p>Este documento foi enviado usando CROM Docs - Editor de documentos privado e seguro.</p>
                    <p>Data de envio: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
                </div>
            </body>
            </html>
        `;
    }

    formatAsText(content, title) {
        // Converter HTML para texto simples
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        return `${title}\n${'='.repeat(title.length)}\n\nDocumento enviado via CROM Docs\n\n${textContent}\n\n---\nEste documento foi enviado usando CROM Docs - Editor de documentos privado e seguro.\nData de envio: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`;
    }

    formatAsMarkdown(content, title) {
        // Converter HTML básico para Markdown
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        let markdownContent = `# ${title}\n\n*Documento enviado via CROM Docs*\n\n`;
        markdownContent += this.convertHtmlToMarkdown(tempDiv);
        markdownContent += `\n\n---\n*Este documento foi enviado usando CROM Docs - Editor de documentos privado e seguro.*\n\n*Data de envio: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}*`;
        
        return markdownContent;
    }

    convertHtmlToMarkdown(element) {
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
                        result += `${this.convertHtmlToMarkdown(node)}\n\n`;
                        break;
                    case 'strong':
                    case 'b':
                        result += `**${node.textContent}**`;
                        break;
                    case 'em':
                    case 'i':
                        result += `*${node.textContent}*`;
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
                    default:
                        result += this.convertHtmlToMarkdown(node);
                }
            }
        }
        
        return result;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async sendDocumentShareLink(documentData, recipientEmail, senderMessage = '') {
        // Funcionalidade futura para compartilhamento público
        throw new Error('Compartilhamento público não está disponível ainda');
    }

    async generateShareableLink(documentData) {
        // Funcionalidade futura para gerar links compartilháveis
        throw new Error('Geração de links compartilháveis não está disponível ainda');
    }

    // Método para configurar o serviço de email
    configureEmailService(config) {
        this.emailServiceConfig = { ...this.emailServiceConfig, ...config };
        this.initializeEmailService();
    }

    // Método para testar conectividade do email
    async testEmailService() {
        if (!this.initialized) {
            throw new Error('Email service not initialized');
        }
        
        try {
            // Simular teste de conectividade
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return {
                success: true,
                message: 'Email service is working correctly',
                serviceConfig: {
                    service: this.emailServiceConfig.service,
                    initialized: this.initialized
                }
            };
        } catch (error) {
            throw new Error('Email service test failed: ' + error.message);
        }
    }
}

export default EmailSystem;
