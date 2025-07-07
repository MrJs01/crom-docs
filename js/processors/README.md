# Processadores de Arquivo - CROM Docs

Este diretório contém os processadores responsáveis por converter diferentes tipos de arquivo para o formato HTML usado pelo editor.

## Arquivos

### PDFProcessor.js
- **Função**: Processa arquivos PDF usando PDF.js
- **Biblioteca**: PDF.js via CDN
- **Funcionalidades**: Extração de texto, metadados, suporte a múltiplas páginas
- **Limitações**: Não extrai imagens ou tabelas complexas

### WordProcessor.js
- **Função**: Processa arquivos Word (.docx, .doc)
- **Biblioteca**: mammoth.js via CDN
- **Funcionalidades**: Conversão HTML completa, imagens em base64
- **Limitações**: Algumas formatações complexas podem ser perdidas

### HTMLProcessor.js
- **Função**: Processa arquivos HTML
- **Biblioteca**: DOM Parser nativo
- **Funcionalidades**: Sanitização, remoção de scripts, extração de metadados
- **Limitações**: Remove elementos perigosos por segurança

### TextProcessor.js
- **Função**: Processa arquivos de texto simples
- **Biblioteca**: Nativa
- **Funcionalidades**: Conversão para HTML, detecção de títulos
- **Limitações**: Formatação limitada

### MarkdownProcessor.js
- **Função**: Processa arquivos Markdown
- **Biblioteca**: marked.js via CDN
- **Funcionalidades**: Conversão completa, front matter, syntax highlighting
- **Limitações**: Dependente da sintaxe Markdown

### RTFProcessor.js
- **Função**: Processa arquivos RTF
- **Biblioteca**: Parser customizado
- **Funcionalidades**: Extração de texto, formatação básica
- **Limitações**: Implementação básica, formatação limitada

## Interface Comum

Todos os processadores implementam a seguinte interface:

```javascript
class BaseProcessor {
    constructor() {
        this.name = 'ProcessorName';
        this.supportedTypes = ['mime/type'];
    }

    // Método principal de processamento
    async process(file, options = {}) {
        return {
            content: 'HTML convertido',
            metadata: { /* metadados */ },
            title: 'Título do documento'
        };
    }

    // Preview rápido
    async preview(file, maxLength = 500) {
        return {
            preview: 'Texto preview',
            stats: { /* estatísticas */ }
        };
    }

    // Verifica disponibilidade
    static async isAvailable() {
        return true;
    }
}
```

## Carregamento Dinâmico

Os processadores são carregados dinamicamente pelo FileImportManager apenas quando necessário:

```javascript
await this.loadProcessor('pdf'); // Carrega PDFProcessor
const result = await this.processors.pdf.process(file);
```

## Bibliotecas Externas

As bibliotecas são carregadas via CDN:

- **PDF.js**: Para processamento de PDF
- **mammoth.js**: Para processamento de Word
- **marked.js**: Para processamento de Markdown

## Tratamento de Erros

Todos os processadores têm tratamento de erro consistente:

```javascript
try {
    const result = await processor.process(file);
    return { success: true, ...result };
} catch (error) {
    return { success: false, error: error.message };
}
```

## Desenvolvimento

### Adicionando Novo Processador

1. Criar arquivo `NewProcessor.js`
2. Implementar interface comum
3. Adicionar no FileImportManager
4. Atualizar tipos suportados
5. Testar com página de teste

### Exemplo de Novo Processador

```javascript
class NewProcessor {
    constructor() {
        this.name = 'NewProcessor';
        this.supportedTypes = ['application/new-type'];
    }

    async process(file, options = {}) {
        // Implementar lógica de processamento
        return {
            content: htmlContent,
            metadata: metadata,
            title: title
        };
    }

    async preview(file, maxLength = 500) {
        // Implementar preview
        return {
            preview: previewText,
            stats: statistics
        };
    }

    static async isAvailable() {
        // Verificar dependências
        return true;
    }
}

export default NewProcessor;
```

### Boas Práticas

1. **Validação**: Sempre validar entrada
2. **Sanitização**: Limpar conteúdo HTML
3. **Fallbacks**: Ter alternativas para falhas
4. **Performance**: Otimizar para arquivos grandes
5. **Metadados**: Extrair informações úteis
6. **Testes**: Testar com arquivos reais

## Dependências

- **FileUtils**: Utilitários para manipulação de arquivos
- **EscapeHtml**: Sanitização de HTML
- **Bootstrap**: Classes CSS para formatação

## Notas Técnicas

- Todos os processadores são ES6 modules
- Carregamento assíncrono de bibliotecas
- Tratamento de arquivos grandes com timeouts
- Sanitização de segurança obrigatória
- Suporte a diferentes encodings de texto
