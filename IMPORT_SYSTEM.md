# Sistema de Importação de Arquivos - CROM Docs

## Visão Geral

O sistema de importação de arquivos do CROM Docs permite importar diversos tipos de documentos e convertê-los para o formato HTML editável usado pelo editor.

## Funcionalidades

### Tipos de Arquivo Suportados

- **PDF**: Extração de texto usando PDF.js
- **Word (.docx, .doc)**: Conversão usando mammoth.js
- **HTML**: Processamento e sanitização
- **Texto (.txt)**: Conversão para HTML com formatação básica
- **Markdown (.md)**: Conversão para HTML usando marked.js
- **RTF**: Processamento básico com parser customizado

### Características

- **Drag & Drop**: Interface amigável para arrastar e soltar arquivos
- **Preview**: Visualização prévia do conteúdo antes da importação
- **Validação**: Verificação de tipo e tamanho de arquivo
- **Processamento Assíncrono**: Não bloqueia a interface durante a conversão
- **Metadados**: Extração de informações como título, autor, etc.
- **Opções de Processamento**: Configurações para preservar formatação, extrair imagens, etc.

## Arquitetura

### Componentes Principais

1. **FileImportManager**: Gerenciador principal que coordena todo o processo
2. **Processadores**: Classes específicas para cada tipo de arquivo
3. **ImportManager**: Integração com a interface do usuário
4. **fileUtils**: Utilitários para manipulação de arquivos

### Fluxo de Importação

1. **Seleção**: Usuário seleciona arquivo via drag & drop ou input
2. **Validação**: Verifica tipo, tamanho e integridade do arquivo
3. **Preview**: Gera visualização prévia do conteúdo
4. **Processamento**: Converte o arquivo para HTML
5. **Importação**: Cria documento no sistema com o conteúdo convertido

## Uso

### Interface do Usuário

A interface de importação está disponível em:
- **Menu Lateral**: Link "Importar Documento"
- **Abas**: Interface com tabs para diferentes tipos de importação

### Exemplo de Uso via JavaScript

```javascript
import FileImportManager from './js/managers/FileImportManager.js';

const fileImportManager = new FileImportManager();

// Processar arquivo
const result = await fileImportManager.processFile(file, {
    preserveFormatting: true,
    extractImages: true,
    processLinks: true
});

if (result.success) {
    console.log('Título:', result.title);
    console.log('Conteúdo:', result.content);
    console.log('Metadados:', result.metadata);
}
```

## Processadores

### PDFProcessor

- **Biblioteca**: PDF.js
- **Funcionalidades**: Extração de texto por página, metadados
- **Limitações**: Não extrai imagens ou tabelas complexas

### WordProcessor

- **Biblioteca**: mammoth.js
- **Funcionalidades**: Conversão HTML completa, imagens em base64
- **Limitações**: Algumas formatações complexas podem ser perdidas

### HTMLProcessor

- **Funcionalidades**: Sanitização, remoção de scripts
- **Limitações**: Remove elementos perigosos por segurança

### TextProcessor

- **Funcionalidades**: Conversão para HTML, detecção de títulos
- **Limitações**: Formatação limitada

### MarkdownProcessor

- **Biblioteca**: marked.js
- **Funcionalidades**: Conversão completa, front matter
- **Limitações**: Dependente da sintaxe Markdown

### RTFProcessor

- **Funcionalidades**: Parser básico customizado
- **Limitações**: Implementação básica, formatação limitada

## Configuração

### Tamanhos de Arquivo

- **Máximo padrão**: 10MB
- **Configurável**: Via opções de validação

### Tipos MIME Suportados

```javascript
{
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/msword': 'doc',
    'text/html': 'html',
    'text/plain': 'txt',
    'text/markdown': 'md',
    'application/rtf': 'rtf'
}
```

## Dependências Externas

### CDN Libraries

- **PDF.js**: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`
- **mammoth.js**: `https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js`
- **marked.js**: `https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js`

### Carregamento Dinâmico

As bibliotecas são carregadas dinamicamente apenas quando necessário, otimizando o tempo de carregamento inicial.

## Tratamento de Erros

### Tipos de Erro

- **Arquivo não suportado**: Tipo MIME ou extensão não reconhecida
- **Arquivo muito grande**: Excede limite de tamanho
- **Erro de leitura**: Arquivo corrompido ou inacessível
- **Erro de processamento**: Falha na conversão
- **Erro de biblioteca**: Biblioteca externa não disponível

### Fallbacks

- **RTF**: Parser customizado quando biblioteca não disponível
- **Texto**: Conversão básica para formatos não suportados
- **Erro**: Mensagens amigáveis para o usuário

## Segurança

### Sanitização

- **HTML**: Remove scripts, iframes e elementos perigosos
- **Atributos**: Remove event handlers e JavaScript
- **Links**: Validação de URLs suspeitas

### Validação

- **Tipos**: Verificação de extensão e MIME type
- **Tamanhos**: Limites configuráveis
- **Conteúdo**: Verificação de integridade

## Testes

### Página de Teste

Disponível em `test_import.html` para testar:
- Carregamento de bibliotecas
- Processamento de arquivos
- Validação e erros

### Uso da Página de Teste

1. Abra `test_import.html`
2. Clique em "Testar Bibliotecas"
3. Arraste um arquivo para a área de drop
4. Clique em "Processar Arquivo"
5. Observe os resultados e logs

## Melhorias Futuras

### Funcionalidades Planejadas

- **Suporte a mais formatos**: EPUB, ODT, etc.
- **Processamento de imagens**: OCR para PDFs scaneados
- **Processamento em lotes**: Múltiplos arquivos
- **Compressão**: Otimização de imagens grandes
- **Histórico**: Rastreamento de importações

### Otimizações

- **Web Workers**: Processamento em background
- **Streaming**: Para arquivos grandes
- **Cache**: Bibliotecas e resultados
- **Progressão**: Indicadores de progresso detalhados

## Suporte

### Problemas Conhecidos

1. **PDFs complexos**: Layouts podem ser alterados
2. **Imagens grandes**: Podem causar lentidão
3. **Arquivos corrompidos**: Podem travar o processamento
4. **Bibliotecas externas**: Dependência de CDN

### Soluções

1. **Timeout**: Processamento com limite de tempo
2. **Validação**: Verificações adicionais
3. **Fallbacks**: Alternativas para falhas
4. **Feedback**: Mensagens claras para usuário

## Changelog

### v1.0.0 (Inicial)
- Implementação básica de todos os processadores
- Interface drag & drop
- Validação e preview
- Integração com sistema de documentos

### Roadmap

- **v1.1.0**: Web Workers e processamento assíncrono
- **v1.2.0**: Suporte a mais formatos
- **v1.3.0**: Processamento em lotes
- **v2.0.0**: Refatoração completa com melhorias de performance
