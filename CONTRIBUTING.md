# Guia de Contribuição - CROM Docs

Obrigado por seu interesse em contribuir com o CROM Docs! Este guia irá ajudá-lo a contribuir de forma efetiva.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Diretrizes de Desenvolvimento](#diretrizes-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Funcionalidades](#sugerindo-funcionalidades)

## 🤝 Código de Conduta

Este projeto adere ao [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Ao participar, você está concordando em seguir este código.

## 🚀 Como Contribuir

Existem várias maneiras de contribuir com o CROM Docs:

### 🐛 Reportando Bugs
- Use as [Issues do GitHub](https://github.com/crom-live/crom-docs/issues)
- Verifique se o bug já foi reportado
- Forneça informações detalhadas

### 💡 Sugerindo Funcionalidades
- Abra uma Issue com o label "enhancement"
- Descreva a funcionalidade desejada
- Explique o caso de uso

### 🔧 Contribuindo com Código
- Faça fork do repositório
- Crie uma branch para sua feature
- Implemente suas alterações
- Teste thoroughmente
- Submeta um Pull Request

### 📝 Melhorando Documentação
- Correções de typos
- Adição de exemplos
- Tradução de conteúdo
- Esclarecimento de conceitos

## 🔧 Configuração do Ambiente

### Pré-requisitos
- Servidor web local (Apache/Nginx/PHP/Python/Node.js)
- Navegador moderno (Chrome/Firefox/Safari/Edge)
- Editor de código (VS Code recomendado)

### Configuração

1. **Fork e Clone**:
```bash
git clone https://github.com/SEU-USUARIO/crom-docs.git
cd crom-docs
```

2. **Configure o servidor**:
```bash
# Opção 1: PHP
php -S localhost:8000

# Opção 2: Python
python -m http.server 8000

# Opção 3: Node.js
npx http-server -p 8000
```

3. **Abra no navegador**:
```
http://localhost:8000
```

## 📋 Diretrizes de Desenvolvimento

### 🏗️ Arquitetura

O CROM Docs segue uma arquitetura modular:

```
js/
├── modules/     # Módulos principais (DocumentManager, Editor)
├── managers/    # Gerenciadores de sistema (UI, Export, Import)
├── systems/     # Sistemas especializados (Tutorial, Email)
├── processors/  # Processadores de arquivo (PDF, Word, HTML)
├── utils/       # Utilitários e helpers
└── config/      # Configurações
```

### 🎯 Princípios

1. **Modularidade**: Cada funcionalidade em seu próprio módulo
2. **Responsabilidade Única**: Cada classe tem uma responsabilidade clara
3. **Reutilização**: Código compartilhado em utils
4. **Manutenibilidade**: Código limpo e bem documentado

### 📦 Adicionando Novas Funcionalidades

#### 1. Novos Processadores de Arquivo

```javascript
// js/processors/NovoProcessor.js
export class NovoProcessor {
    constructor() {
        this.name = 'Novo Processor';
        this.supportedTypes = ['application/novo-tipo'];
    }

    async process(file, options = {}) {
        // Implementar processamento
        return {
            content: 'HTML convertido',
            metadata: {},
            title: 'Título extraído'
        };
    }

    async preview(file, maxLength = 500) {
        // Implementar preview
        return {
            preview: 'Preview do conteúdo',
            stats: { words: 0, chars: 0 }
        };
    }

    static async isAvailable() {
        // Verificar se bibliotecas necessárias estão disponíveis
        return true;
    }
}
```

#### 2. Novos Gerenciadores

```javascript
// js/managers/NovoManager.js
export class NovoManager {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;
        
        // Configurar eventos
        this.setupEvents();
        
        this.initialized = true;
    }

    setupEvents() {
        // Configurar event listeners
    }
}
```

#### 3. Novos Sistemas

```javascript
// js/systems/NovoSystem.js
export class NovoSystem {
    constructor(config) {
        this.config = config;
        this.active = false;
    }

    activate() {
        if (this.active) return;
        
        // Ativar sistema
        this.active = true;
    }

    deactivate() {
        if (!this.active) return;
        
        // Desativar sistema
        this.active = false;
    }
}
```

## 📝 Padrões de Código

### JavaScript

#### Estilo de Código
```javascript
// ✅ Bom
class DocumentManager {
    constructor() {
        this.documents = new Map();
        this.currentDocument = null;
    }

    async loadDocument(id) {
        try {
            const doc = await this.fetchDocument(id);
            return doc;
        } catch (error) {
            console.error('Erro ao carregar documento:', error);
            throw error;
        }
    }
}

// ❌ Ruim
class documentmanager {
    constructor() {
        this.docs = {};
    }

    loadDoc(id) {
        return localStorage.getItem(id);
    }
}
```

#### Nomenclatura
- **Classes**: PascalCase (`DocumentManager`)
- **Variáveis/Métodos**: camelCase (`currentDocument`)
- **Constantes**: UPPER_CASE (`STORAGE_KEY`)
- **Arquivos**: camelCase (`documentManager.js`)

#### Documentação
```javascript
/**
 * Gerencia documentos da aplicação
 */
export class DocumentManager {
    /**
     * Carrega um documento pelo ID
     * @param {string} id - ID do documento
     * @returns {Promise<Object>} Documento carregado
     * @throws {Error} Se documento não for encontrado
     */
    async loadDocument(id) {
        // Implementação
    }
}
```

### CSS

#### Estrutura
```css
/* Componente principal */
.document-editor {
    /* Propriedades de layout */
    display: flex;
    flex-direction: column;
    
    /* Propriedades visuais */
    background: #24282e;
    border-radius: 8px;
    
    /* Propriedades de texto */
    font-family: 'Segoe UI', sans-serif;
    color: #e0e6eb;
}

/* Estados */
.document-editor:hover {
    background: #2a2f35;
}

.document-editor.active {
    border: 2px solid #0d6efd;
}
```

#### Nomenclatura
- Use kebab-case para classes
- Prefixe componentes específicos
- Use modificadores BEM quando aplicável

### HTML

#### Estrutura Semântica
```html
<!-- ✅ Bom -->
<main class="main-content">
    <section class="document-editor">
        <header class="editor-toolbar">
            <button type="button" class="btn btn-primary" aria-label="Negrito">
                <i class="bi bi-type-bold" aria-hidden="true"></i>
            </button>
        </header>
        <div class="editor-content" contenteditable="true" role="textbox">
            <!-- Conteúdo do documento -->
        </div>
    </section>
</main>

<!-- ❌ Ruim -->
<div class="content">
    <div class="editor">
        <div class="toolbar">
            <div onclick="bold()">B</div>
        </div>
        <div contenteditable="true">
            <!-- Conteúdo -->
        </div>
    </div>
</div>
```

## 🔄 Processo de Pull Request

### 1. Preparação

```bash
# Criar branch
git checkout -b feature/nova-funcionalidade

# Fazer alterações
# ... desenvolvimento ...

# Testar thoroughly
# ... testes ...

# Commit com mensagem clara
git commit -m "feat: adiciona nova funcionalidade X"
```

### 2. Convenções de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção

# Exemplos
feat: adiciona processador de arquivos EPUB
fix: corrige bug na exportação PDF
docs: atualiza guia de instalação
style: formata código do DocumentManager
refactor: reorganiza estrutura de pastas
test: adiciona testes para ImportManager
chore: atualiza dependências
```

### 3. Checklist do PR

Antes de submeter:

- [ ] Código segue os padrões estabelecidos
- [ ] Funcionalidade foi testada thoroughmente
- [ ] Documentação foi atualizada
- [ ] Commits seguem convenções
- [ ] Não há conflitos com main
- [ ] Funcionalidade não quebra existente

### 4. Revisão

- O PR será revisado por mantenedores
- Feedback será fornecido se necessário
- Alterações podem ser solicitadas
- Merge será feito após aprovação

## 🐛 Reportando Bugs

### Template de Bug Report

```markdown
**Descrição do Bug**
Descrição clara e concisa do bug.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [e.g. Windows 10, macOS 11]
- Navegador: [e.g. Chrome 96, Firefox 95]
- Versão: [e.g. 1.0.0]

**Contexto Adicional**
Qualquer outra informação relevante.
```

### Severidade

- **Crítica**: Aplicação não funciona
- **Alta**: Funcionalidade principal quebrada
- **Média**: Funcionalidade secundária afetada
- **Baixa**: Problema cosmético

## 💡 Sugerindo Funcionalidades

### Template de Feature Request

```markdown
**Problema a Resolver**
Descrição do problema ou necessidade.

**Solução Proposta**
Descrição da solução desejada.

**Alternativas Consideradas**
Outras soluções consideradas.

**Benefícios**
- Benefício 1
- Benefício 2
- Benefício 3

**Implementação**
Ideias sobre como implementar.

**Mockups/Wireframes**
Se aplicável, adicione mockups.
```

### Priorização

Funcionalidades são priorizadas baseado em:
- Impacto no usuário
- Complexidade de implementação
- Alinhamento com roadmap
- Demanda da comunidade

## 📚 Recursos Adicionais

### Documentação
- [Sistema de Importação](IMPORT_SYSTEM.md)
- [Guia de Importação](GUIA_IMPORTACAO.md)
- [Funcionalidades](FEATURES.md)

### Ferramentas Recomendadas
- **Editor**: VS Code com extensões ES6
- **Debugging**: Chrome DevTools
- **Testing**: Navegador + console
- **Documentation**: JSDoc

### Comunidade
- [GitHub Issues](https://github.com/crom-live/crom-docs/issues)
- [GitHub Discussions](https://github.com/crom-live/crom-docs/discussions)
- [Website](https://crom.live)

## 🎯 Próximos Passos

Depois de ler este guia:

1. **Configure o ambiente** de desenvolvimento
2. **Explore o código** existente
3. **Escolha uma issue** para trabalhar
4. **Faça sua primeira contribuição**
5. **Participe da comunidade**

## ❓ Dúvidas?

Se você tiver dúvidas sobre como contribuir:

1. Verifique a documentação existente
2. Procure em issues anteriores
3. Abra uma nova issue com sua dúvida
4. Use GitHub Discussions para conversas

---

**Obrigado por contribuir com o CROM Docs!** 🙏

Sua contribuição ajuda a tornar o projeto melhor para todos os usuários.
