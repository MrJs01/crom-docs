# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planejado
- Suporte a tabelas no editor
- Upload de imagens
- Sistema de comentários
- Histórico de versões
- Aplicação PWA

## [1.0.0] - 2024-07-25

### Adicionado
- **Editor Rico**: Formatação completa (negrito, itálico, títulos, listas)
- **Sistema de Documentos**: Criação, edição, salvamento e exclusão
- **Organização**: Categorias, etiquetas e busca avançada
- **Dashboard**: Visão geral de todos os documentos
- **Exportação**: Suporte a PDF, Word, HTML, Markdown e TXT
- **Importação**: Suporte a PDF, Word, HTML, Markdown, RTF e TXT
- **Interface Moderna**: Tema escuro otimizado para produtividade
- **Sidebar**: Navegação lateral com lista de documentos
- **Auto-salvamento**: Salvamento automático configurável
- **Tutorial**: Sistema de ajuda integrado
- **URLs Compartilháveis**: Sistema de navegação por URL
- **Atalhos de Teclado**: Suporte a atalhos padrão (Ctrl+B, Ctrl+I, etc.)

#### Editor
- Formatação rica em tempo real
- Suporte a 6 níveis de títulos (H1-H6)
- Listas ordenadas e não ordenadas
- Alinhamento (esquerda, centro, direita, justificado)
- Inserção e edição de links
- Controle de recuo e indentação
- Limpeza de formatação

#### Organização
- Sistema de categorias flexível
- Etiquetas múltiplas por documento
- Busca em tempo real no conteúdo
- Filtros por categoria
- Ordenação por data, nome, etc.
- Estatísticas de documentos e palavras

#### Exportação
- **PDF**: Múltiplos temas (claro/escuro/personalizado)
- **Word (.docx)**: Configurações de fonte e sumário
- **HTML**: Estilos customizados e temas
- **Markdown**: Conversão limpa
- **TXT**: Formato texto simples
- **Email**: Envio direto por email

#### Importação
- **PDF**: Extração de texto e metadados
- **Word**: Conversão completa com imagens
- **HTML**: Sanitização e limpeza
- **Markdown**: Suporte a front matter
- **RTF**: Processamento básico
- **TXT**: Detecção automática de estrutura
- **JSON**: Backup e restauração

#### Interface
- Tema escuro moderno
- Sidebar retrátil
- Toolbar de formatação
- Modais para configurações
- Notificações elegantes
- Tela de loading
- Responsividade mobile

#### Sistemas
- **Tutorial**: Sistema de ajuda contextual
- **Context Menu**: Menu de contexto nos documentos
- **Email**: Envio de documentos por email
- **JSON Copy**: Visualização e cópia de JSON
- **URL Manager**: Navegação por URL
- **Loading Manager**: Gerenciamento de estados de loading

### Técnico
- **Arquitetura Modular**: Sistema baseado em ES6 modules
- **Local Storage**: Armazenamento local seguro
- **Import Maps**: Sistema de importação otimizado
- **Processadores**: Sistema plugável para diferentes formatos
- **Gerenciadores**: Separação clara de responsabilidades
- **Utilitários**: Funções reutilizáveis
- **Configurações**: Sistema de configuração centralizado

### Bibliotecas Integradas
- **Bootstrap 5.3**: Framework CSS
- **Bootstrap Icons**: Ícones
- **SweetAlert2**: Notificações
- **jsPDF**: Exportação PDF
- **docx**: Exportação Word
- **html2canvas**: Screenshots
- **PDF.js**: Processamento PDF
- **mammoth.js**: Processamento Word
- **marked.js**: Processamento Markdown

### Segurança
- **Sanitização HTML**: Todo conteúdo é sanitizado
- **Validação de Arquivos**: Verificação de tipos e tamanhos
- **Armazenamento Local**: Dados não saem do navegador
- **Sem Telemetria**: Nenhum tracking ou analytics
- **CSP**: Content Security Policy
- **Remoção de Scripts**: Scripts maliciosos são removidos

### Performance
- **Carregamento Assíncrono**: Bibliotecas carregadas sob demanda
- **Lazy Loading**: Processadores carregados quando necessário
- **Otimizações**: Código otimizado para performance
- **Caching**: Cache de bibliotecas externas
- **Compressão**: Estilos e scripts otimizados

### Acessibilidade
- **ARIA**: Atributos de acessibilidade
- **Keyboard Navigation**: Navegação por teclado
- **Screen Reader**: Suporte a leitores de tela
- **Contraste**: Cores com contraste adequado
- **Semântica**: HTML semântico

### Compatibilidade
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Responsividade**: Suporte a desktop, tablet e mobile
- **Formatos**: Ampla compatibilidade de formatos
- **Encoding**: Suporte a UTF-8 e outros encodings

### Documentação
- **README.md**: Documentação principal
- **IMPORT_SYSTEM.md**: Sistema de importação
- **GUIA_IMPORTACAO.md**: Guia do usuário
- **FEATURES.md**: Funcionalidades
- **CONTRIBUTING.md**: Guia de contribuição
- **CHANGELOG.md**: Histórico de mudanças

## [0.9.0] - 2024-07-20 (Beta)

### Adicionado
- Versão beta para testes
- Editor básico funcional
- Sistema de documentos
- Exportação básica
- Interface inicial

### Corrigido
- Bugs de compatibilidade
- Problemas de performance
- Questões de usabilidade

## [0.8.0] - 2024-07-15 (Alpha)

### Adicionado
- Primeira versão alpha
- Conceito inicial
- Prototipagem
- Testes iniciais

### Limitações
- Funcionalidades limitadas
- Interface básica
- Sem exportação
- Sem importação

---

## Tipos de Mudanças

- **Adicionado**: para novas funcionalidades
- **Alterado**: para mudanças em funcionalidades existentes
- **Depreciado**: para funcionalidades que serão removidas
- **Removido**: para funcionalidades removidas
- **Corrigido**: para correções de bugs
- **Segurança**: para vulnerabilidades

## Versionamento

Este projeto usa [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Funcionalidades adicionadas de forma compatível
- **PATCH**: Correções de bugs compatíveis

## Links

- [Repositório](https://github.com/crom-live/crom-docs)
- [Issues](https://github.com/crom-live/crom-docs/issues)
- [Releases](https://github.com/crom-live/crom-docs/releases)
- [Website](https://crom.live)
