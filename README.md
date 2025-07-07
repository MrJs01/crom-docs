# CROM Docs 📝

<div align="center">
  <img src="https://crom.live/wp-content/uploads/2024/12/CROM_dark-removebg-preview.png" alt="CROM Docs Logo" width="100" height="80">
  
  <h3>Editor de Documentos Privado e Moderno</h3>
  <p>Uma alternativa poderosa ao Google Docs e Notion, com foco em privacidade e produtividade.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
</div>

---

## 🚀 Visão Geral

O **CROM Docs** é um editor de documentos moderno e elegante que oferece uma experiência de escrita rica, similar ao Google Docs e Notion, mas com foco total em privacidade. Todos os documentos são armazenados localmente no seu navegador, garantindo que seus dados nunca saiam do seu controle.

### ✨ Principais Características

- **🔒 Privacidade Total**: Todos os documentos são salvos localmente no navegador
- **📝 Editor Rico**: Suporte completo a formatação avançada, títulos, listas, links
- **🎨 Tema Escuro**: Interface moderna otimizada para produtividade
- **📁 Organização Inteligente**: Categorias, etiquetas e busca avançada
- **📤 Exportação Flexível**: Múltiplos formatos (PDF, Word, HTML, Markdown, TXT)
- **📥 Importação Avançada**: Suporte a PDF, Word, HTML, Markdown, RTF
- **🔄 Auto-salvamento**: Nunca perca seu trabalho
- **🌐 URLs Compartilháveis**: Navegação por URL e histórico do navegador

## 🎯 Funcionalidades Principais

### 📝 Editor Avançado
- **Formatação Rica**: Negrito, itálico, sublinhado, tachado
- **Títulos**: 6 níveis de títulos (H1-H6)
- **Listas**: Listas ordenadas e não ordenadas
- **Alinhamento**: Esquerda, centro, direita, justificado
- **Links**: Inserção e edição de links
- **Recuo**: Controle de indentação
- **Atalhos**: Suporte a atalhos de teclado padrão

### 🗂️ Organização
- **Categorias**: Organize documentos por projetos ou tipos
- **Etiquetas**: Sistema de tags para classificação
- **Busca**: Busca avançada por nome, categoria ou conteúdo
- **Filtros**: Filtros por categoria e ordenação
- **Dashboard**: Visão geral de todos os documentos

### 📤 Exportação
- **PDF**: Com temas claro/escuro/personalizado
- **Word (.docx)**: Com configurações de fonte e sumário
- **HTML**: Com estilos customizados
- **Markdown**: Para compatibilidade universal
- **Texto**: Formato simples
- **Email**: Envio direto por email

### 📥 Importação
- **PDF**: Extração de texto e metadados
- **Word**: Conversão completa com imagens
- **HTML**: Sanitização e processamento
- **Markdown**: Conversão com front matter
- **RTF**: Suporte básico
- **JSON**: Backup e restauração

## 🛠️ Arquitetura Técnica

### 📁 Estrutura do Projeto

```
crom-docs/
├── index.php                 # Arquivo principal da aplicação
├── style.css                 # Estilos globais
├── js/
│   ├── main.js              # Ponto de entrada principal
│   ├── config/
│   │   └── appConfig.js     # Configurações da aplicação
│   ├── managers/            # Gerenciadores de sistema
│   │   ├── AppStateManager.js
│   │   ├── UIManager.js
│   │   ├── ExportManager.js
│   │   ├── ImportManager.js
│   │   └── ...
│   ├── modules/            # Módulos principais
│   │   ├── DocumentManager.js
│   │   └── Editor.js
│   ├── processors/         # Processadores de arquivo
│   │   ├── PDFProcessor.js
│   │   ├── WordProcessor.js
│   │   ├── HTMLProcessor.js
│   │   └── ...
│   ├── systems/           # Sistemas especializados
│   │   ├── TutorialSystem.js
│   │   ├── EmailSystem.js
│   │   └── ...
│   └── utils/             # Utilitários
│       ├── exportUtils.js
│       ├── fileUtils.js
│       └── ...
├── docs/                  # Documentação
│   ├── IMPORT_SYSTEM.md
│   ├── GUIA_IMPORTACAO.md
│   └── FEATURES.md
```

### 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS**: Bootstrap 5.3
- **Ícones**: Bootstrap Icons
- **Armazenamento**: Local Storage API
- **Bibliotecas de Exportação**:
  - jsPDF (PDF)
  - docx (Word)
  - html2canvas (Screenshots)
- **Bibliotecas de Importação**:
  - PDF.js (PDF)
  - mammoth.js (Word)
  - marked.js (Markdown)
- **Notificações**: SweetAlert2
- **Arquitetura**: Modular ES6 com Import Maps

## 🚀 Instalação e Uso

### 📋 Pré-requisitos

- Servidor web (Apache, Nginx, ou servidor de desenvolvimento)
- Navegador moderno com suporte a ES6+ e Local Storage

### 🔧 Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/crom-live/crom-docs.git
cd crom-docs
```

2. **Configure o servidor web**:
```bash
# Com PHP (recomendado)
php -S localhost:8000

# Com Python
python -m http.server 8000

# Com Node.js
npx http-server -p 8000
```

3. **Acesse a aplicação**:
```
http://localhost:8000
```

### 🎯 Uso Básico

1. **Criar Documento**: Clique em "Novo Documento" na barra lateral
2. **Escrever**: Use o editor rico para criar seu conteúdo
3. **Organizar**: Defina categorias e etiquetas
4. **Exportar**: Escolha o formato desejado
5. **Importar**: Arraste arquivos para importar

## 📚 Documentação

### 📖 Guias Disponíveis

- [**Sistema de Importação**](IMPORT_SYSTEM.md) - Documentação técnica completa
- [**Guia de Importação**](GUIA_IMPORTACAO.md) - Manual do usuário
- [**Funcionalidades**](FEATURES.md) - Recursos implementados

### 🎯 Recursos Principais

#### 📝 Editor
- Interface limpa e moderna
- Formatação rica em tempo real
- Atalhos de teclado intuitivos
- Auto-salvamento configurável

#### 🗂️ Organização
- Sistema de categorias flexível
- Etiquetas múltiplas por documento
- Busca em tempo real
- Filtros avançados

#### 📤 Exportação
- Múltiplos formatos suportados
- Configurações personalizáveis
- Preview antes da exportação
- Envio por email integrado

#### 📥 Importação
- Interface drag & drop
- Preview antes da importação
- Processamento assíncrono
- Suporte a múltiplos formatos

## 🔒 Privacidade e Segurança

### 🛡️ Compromissos de Privacidade

- **Armazenamento Local**: Todos os dados ficam no seu navegador
- **Sem Telemetria**: Nenhum dado é enviado para servidores externos
- **Sem Cookies**: Não utilizamos cookies de rastreamento
- **Código Aberto**: Código totalmente transparente e auditável

### 🔐 Segurança

- **Sanitização HTML**: Todo conteúdo importado é sanitizado
- **Validação de Arquivos**: Verificação de tipos e tamanhos
- **CSP**: Content Security Policy implementada
- **Sem Execução de Scripts**: Scripts externos são removidos

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja como você pode ajudar:


### 🔧 Desenvolvimento

1. **Fork o repositório**
2. **Crie uma branch para sua feature**:
```bash
git checkout -b feature/nova-funcionalidade
```
3. **Faça suas alterações**
4. **Teste thoroughly**
5. **Commit com mensagens claras**:
```bash
git commit -m "feat: adiciona nova funcionalidade X"
```
6. **Push para sua branch**:
```bash
git push origin feature/nova-funcionalidade
```
7. **Abra um Pull Request**

### 📝 Padrões de Código

- **JavaScript**: ES6+ com módulos
- **CSS**: Metodologia BEM quando aplicável
- **HTML**: Semântico e acessível
- **Commits**: Conventional Commits

## 🗺️ Roadmap

### 🎯 Próximas Funcionalidades

- [ ] **Tabelas**: Editor de tabelas integrado
- [ ] **Imagens**: Upload e edição de imagens
- [ ] **Colaboração**: Sistema de comentários
- [ ] **Versionamento**: Histórico de versões
- [ ] **Plugins**: Sistema de extensões
- [ ] **PWA**: Aplicação web progressiva
- [ ] **Sincronização**: Sync opcional com nuvem
- [ ] **Temas**: Temas customizáveis

### 🔄 Melhorias Planejadas

- [ ] **Performance**: Otimizações para documentos grandes
- [ ] **Acessibilidade**: Melhorias de A11Y
- [ ] **Mobile**: Responsividade aprimorada
- [ ] **Testes**: Cobertura de testes automatizados
- [ ] **Documentação**: Guias mais detalhados

## 📈 Estatísticas

- **Linhas de Código**: ~8,000+
- **Arquivos JavaScript**: 25+
- **Formatos Suportados**: 6 (importação) + 5 (exportação)
- **Processadores**: 6 especializados
- **Sistemas**: 4 integrados

## 🏆 Reconhecimentos

### 🙏 Agradecimentos

- **Bootstrap Team** - Framework CSS
- **PDF.js Team** - Processamento de PDF
- **Mammoth.js** - Processamento de Word
- **SweetAlert2** - Notificações elegantes
- **Marked.js** - Processamento de Markdown

### 📜 Licenças

Este projeto usa as seguintes bibliotecas:
- Bootstrap 5.3 (MIT)
- PDF.js (Apache 2.0)
- mammoth.js (BSD-2-Clause)
- marked.js (MIT)
- SweetAlert2 (MIT)

## 📞 Suporte

### 🆘 Precisa de Ajuda?

- **Documentação**: Consulte os guias na pasta `/docs`

### 🌐 Links Úteis

- **Website**: [crom.live](https://crom.live)
- **Demo**: [docs.crom.live](https://docs.crom.live)

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE) - veja o arquivo LICENSE para detalhes.

---

