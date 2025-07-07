# Estrutura do Projeto - Documentação JS

## Visão Geral

O projeto foi refatorado para uma estrutura modular mais organizada, dividindo o código em diferentes diretórios por responsabilidade.

## Estrutura de Diretórios

```
js/
├── main.js                    # Arquivo principal - inicialização da aplicação
├── config/
│   └── appConfig.js          # Configurações da aplicação
├── utils/
│   ├── escapeHtml.js         # Função para escapar HTML
│   ├── sharedView.js         # Funções para visualização compartilhada
│   └── dateUtils.js          # Utilitários de data e função debounce
├── systems/
│   ├── TutorialSystem.js     # Sistema de tutoriais
│   ├── ContextMenuSystem.js  # Sistema de menu de contexto
│   └── JSONCopySystem.js     # Sistema de cópia de JSON
├── managers/
│   ├── AppStateManager.js    # Gerenciador de estado da aplicação
│   ├── UIManager.js          # Gerenciador da interface do usuário
│   ├── EventManager.js       # Gerenciador de eventos
│   ├── ImportManager.js      # Gerenciador de importação
│   ├── GlobalFunctionManager.js # Gerenciador de funções globais
│   └── MenuManager.js        # Gerenciador de menus e toolbar
└── modules/
    ├── DocumentManager.js    # Gerenciador de documentos (já existente)
    └── Editor.js             # Editor de texto (já existente)
```

## Descrição dos Módulos

### Configuração
- **appConfig.js**: Constantes e configurações centralizadas (delays, chaves de localStorage, etc.)

### Utilitários
- **escapeHtml.js**: Função para escapar caracteres HTML
- **sharedView.js**: Funções para modo de visualização compartilhada via URL
- **dateUtils.js**: Funções de formatação de data e utilitário debounce

### Sistemas
- **TutorialSystem.js**: Gerencia sistema de tutoriais e ajuda
- **ContextMenuSystem.js**: Gerencia menu de contexto com clique direito
- **JSONCopySystem.js**: Gerencia cópia de JSON para clipboard

### Gerenciadores
- **AppStateManager.js**: Gerencia estado da aplicação (documento atual, configurações, etc.)
- **UIManager.js**: Gerencia elementos da interface (views, cards, listas, etc.)
- **EventManager.js**: Gerencia eventos da aplicação (editor, UI, documentos, etc.)
- **ImportManager.js**: Gerencia funcionalidades de importação de documentos
- **GlobalFunctionManager.js**: Define funções globais para compatibilidade
- **MenuManager.js**: Gerencia eventos de menu e toolbar

### Principais Benefícios da Refatoração

1. **Modularidade**: Cada funcionalidade está em seu próprio arquivo
2. **Manutenibilidade**: Mais fácil de encontrar e modificar código específico
3. **Reutilização**: Módulos podem ser importados e reutilizados
4. **Testabilidade**: Cada módulo pode ser testado independentemente
5. **Organização**: Código agrupado por responsabilidade

### Compatibilidade

A refatoração mantém todas as funcionalidades existentes. O arquivo `main.js` inicializa todos os módulos e mantém as variáveis globais necessárias para compatibilidade.

### Como Usar

O arquivo `main.js` deve ser importado no HTML como um módulo ES6:

```html
<script type="module" src="js/main.js"></script>
```

Todos os imports são relativos e automáticos, não sendo necessário modificar o HTML além da inclusão do arquivo principal.
