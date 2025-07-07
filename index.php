<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Docs</title>
    <!-- Bootstrap CSS (Dark Theme) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
    <!-- Custom CSS -->
    <link href="style.css" rel="stylesheet">
    <link rel="icon" href="https://crom.live/wp-content/uploads/2024/11/cropped-WhiteSup-1-32x32.png" type="image/png">
    <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-N3481FKQ7L"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-N3481FKQ7L');
</script>
</head>

<body class="bg-dark text-white">

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top" id="main-navbar">
        <div class="container-fluid">
            <a href="#" class="navbar-brand sidebar-documents-link" id="show-dashboard-link">
                <img src="https://crom.live/wp-content/uploads/2024/12/CROM_dark-removebg-preview.png" alt="Logo"
                    width="30" height="24" class="d-inline-block align-text-top">
                Docs
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <!-- File Dropdown -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownFile" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Arquivo
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownFile">
                            <li><a class="dropdown-item" href="#" id="menu-new-document">Novo documento</a></li>
                            <li class="file-menu-options"><a class="dropdown-item" href="#" id="menu-save-document">Salvar documento</a></li>
                            <li class="file-menu-options">
                                <hr class="dropdown-divider">
                            </li>
                            <li class="file-menu-options"><a class="dropdown-item text-danger" href="#" id="menu-delete-document">Excluir
                                    documento atual</a></li>
                        </ul>
                    </li>
                    <!-- Edit Dropdown -->
                    <li class="nav-item dropdown file-menu-options">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownEdit" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Editar
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownEdit">
                            <li><a class="dropdown-item" href="#" data-command="undo">Desfazer</a></li>
                            <li><a class="dropdown-item" href="#" data-command="redo">Refazer</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#" data-command="removeFormat">Limpar Formatação</a></li>
                        </ul>
                    </li>
                    <!-- View e Compartilhar no menu superior -->
                    <li class="nav-item file-menu-options">
                        <a class="nav-link" href="#" id="menu-view-json">
                            <i class="bi bi-filetype-json me-1"></i> Ver JSON
                        </a>
                    </li>
                    <!-- Tutorial Menu -->
                    <li class="nav-item">
                        <a class="nav-link" href="#" id="menu-tutorial">
                            <i class="bi bi-question-circle me-1"></i> Tutorial
                        </a>
                    </li>
                    <!-- Export Menu -->
                    <li class="nav-item file-menu-options">
                        <a class="nav-link" href="#" id="menu-export">
                            <i class="bi bi-file-earmark-arrow-down me-1"></i> Exportar
                        </a>
                    </li>
                    <!-- Removido: Compartilhar -->
                    <!-- Insert Dropdown -->
                    <li class="nav-item dropdown file-menu-options">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownInsert" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Inserir
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownInsert">
                            <li><a class="dropdown-item" href="#" data-command="createLink">Link...</a></li>
                            <li><a class="dropdown-item" href="#" data-command="insertHorizontalRule">Linha
                                    Horizontal</a></li>
                        </ul>
                    </li>
                    <!-- Format Dropdown -->
                    <li class="nav-item dropdown file-menu-options">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownFormat" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Formatar
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownFormat">
                            <li>
                                <h6 class="dropdown-header">Texto</h6>
                            </li>
                            <li><a class="dropdown-item" href="#" data-command="bold">Negrito</a></li>
                            <li><a class="dropdown-item" href="#" data-command="italic">Itálico</a></li>
                            <li><a class="dropdown-item" href="#" data-command="underline">Sublinhado</a></li>
                            <li><a class="dropdown-item" href="#" data-command="strikeThrough">Tachado</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <h6 class="dropdown-header">Estilos de Parágrafo</h6>
                            </li>
                            <li><a class="dropdown-item" href="#" data-command="formatBlock"
                                    data-value="p">Parágrafo</a></li>
                            <li><a class="dropdown-item" href="#" data-command="formatBlock" data-value="h1">Título
                                    1</a></li>
                            <li><a class="dropdown-item" href="#" data-command="formatBlock" data-value="h2">Título
                                    2</a></li>
                            <li><a class="dropdown-item" href="#" data-command="formatBlock" data-value="h3">Título
                                    3</a></li>
                            <li><a class="dropdown-item" href="#" data-command="formatBlock" data-value="h4">Título
                                    4</a></li>
                            <li><a class="dropdown-item" href="#" data-command="formatBlock" data-value="h5">Título
                                    5</a></li>
                            <li><a class="dropdown-item" href="#" data-command="formatBlock" data-value="h6">Título
                                    6</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <h6 class="dropdown-header">Listas</h6>
                            </li>
                            <li><a class="dropdown-item" href="#" data-command="insertUnorderedList">Lista de
                                    Marcadores</a></li>
                            <li><a class="dropdown-item" href="#" data-command="insertOrderedList">Lista Numerada</a>
                            </li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <h6 class="dropdown-header">Alinhamento</h6>
                            </li>
                            <li><a class="dropdown-item" href="#" data-command="justifyLeft">Alinhar à Esquerda</a></li>
                            <li><a class="dropdown-item" href="#" data-command="justifyCenter">Alinhar ao Centro</a>
                            </li>
                            <li><a class="dropdown-item" href="#" data-command="justifyRight">Alinhar à Direita</a></li>
                            <li><a class="dropdown-item" href="#" data-command="justifyFull">Justificar</a></li>
                        </ul>
                    </li>

                </ul>
                <div class="d-flex align-items-center">
                    <button class="btn btn-outline-light me-2 d-none d-lg-block" id="sidebar-toggle-button"
                        type="button" title="Alternar Barra Lateral">
                        <i class="bi bi-layout-sidebar"></i>
                    </button>
                    <div class="form-check form-switch me-3 file-menu-options">
                        <input class="form-check-input" type="checkbox" id="auto-save-toggle">
                        <label class="form-check-label text-light" for="auto-save-toggle">Auto-Salvar</label>
                    </div>
                    <button class="btn btn-primary file-menu-options" id="save-button" type="button" disabled>Salvar</button>

                </div>
            </div>
        </div>
    </nav>

    <!-- Sidebar Floating Toggle Button (agora depois do main-layout-container para CSS funcionar) -->


    <!-- Main Layout (Sidebar + Content) -->
    <div class="d-flex flex-grow-1" id="main-layout-container">
        <!-- Sidebar -->
        <div class="sidebar d-flex flex-column" id="sidebar">

            <ul class="nav flex-column mb-auto" id="document-list">
                <!-- Document items will be injected here by JavaScript, organized by category -->
            </ul>
            <hr class="border-secondary">
            <div class="mt-auto">
                <a href="#" class="nav-link d-flex align-items-center py-2" id="new-document-link">
                    <i class="bi bi-plus-circle me-2"></i> Novo Documento
                </a>
                <a href="#" class="nav-link d-flex align-items-center py-2" id="import-document-link">
                    <i class="bi bi-file-earmark-arrow-up me-2"></i> Importar Documento
                </a>
                <a href="#" class="nav-link d-flex align-items-center py-2" id="settings-link">
                    <i class="bi bi-gear me-2"></i> Configurações
                </a>
            </div>
        </div>

        <!-- Main Content Area -->
        <main class="main-content">
            <!-- Dashboard View -->
            <div id="dashboard-view" class="dashboard-view d-none">
                <!-- System Information Card (Minimizable) -->
                <div id="system-info-card" class="system-info-card mb-4">
                    <div class="system-info-header">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-info-circle-fill me-2 text-primary"></i>
                            <h5 class="mb-0">Sobre o CROM Docs</h5>
                        </div>
                        <button class="btn btn-sm btn-link text-white system-info-minimize-btn" id="system-info-toggle">
                            <i class="bi bi-dash"></i>
                        </button>
                    </div>
                    <div class="system-info-content" id="system-info-content">
                        <div class="row">
                            <div class="col-md-8">
                                <p class="mb-3">Bem-vindo ao <strong>CROM Docs</strong>, seu editor de documentos pessoal, privado e poderoso!</p>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <h6><i class="bi bi-shield-lock me-2 text-success"></i>Privacidade Garantida</h6>
                                        <p class="small text-muted">Todos os seus documentos ficam salvos localmente no seu navegador. Nenhum dado é enviado para servidores externos.</p>
                                    </div>
                                    <div class="col-sm-6">
                                        <h6><i class="bi bi-tools me-2 text-info"></i>Editor Poderoso</h6>
                                        <p class="small text-muted">Formatação rica, títulos, listas, links e muito mais. Tudo que você precisa para criar documentos profissionais.</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <h6><i class="bi bi-folder-fill me-2 text-warning"></i>Organização Inteligente</h6>
                                        <p class="small text-muted">Categorias, etiquetas e busca avançada. Mantenha seus documentos sempre organizados.</p>
                                    </div>
                                    <div class="col-sm-6">
                                        <h6><i class="bi bi-share me-2 text-primary"></i>Exportação Flexível</h6>
                                        <p class="small text-muted">Exporte em JSON, compartilhe via link ou faça backup completo. Seus dados, suas regras.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="quick-stats">
                                    <h6><i class="bi bi-graph-up me-2 text-success"></i>Estatísticas Rápidas</h6>
                                    <div class="stat-item">
                                        <span class="stat-number" id="total-documents">0</span>
                                        <span class="stat-label">Documentos</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number" id="total-categories">0</span>
                                        <span class="stat-label">Categorias</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number" id="total-words">0</span>
                                        <span class="stat-label">Palavras (aprox.)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-start border-bottom border-secondary-subtle mb-4">
                    <ul class="nav nav-tabs border-0" id="documentTabs" role="tablist">
                        <!-- Category tabs will be dynamically injected here by JavaScript -->
                    </ul>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <div class="input-group w-auto flex-grow-1" style="max-width: 400px;">
                        <span class="input-group-text bg-dark border-secondary text-secondary"><i
                                class="bi bi-search"></i></span>
                        <input type="text" class="form-control bg-dark border-secondary text-white" placeholder="Buscar"
                            id="search-documents-input">
                    </div>
                    <div class="d-flex gap-2">
                        <select class="form-select bg-dark border-secondary text-white" id="sort-by-select">
                            <option value="lastModifiedDesc">Ordenar por última atualização (Mais Recente)</option>
                            <option value="lastModifiedAsc">Ordenar por última atualização (Mais Antigo)</option>
                            <option value="createdDesc">Ordenar por data de criação (Mais Recente)</option>
                            <option value="createdAsc">Ordenar por data de criação (Mais Antigo)</option>
                            <option value="nameAsc">Ordenar por nome (A-Z)</option>
                            <option value="nameDesc">Ordenar por nome (Z-A)</option>
                        </select>
                        <button class="btn btn-dark border-secondary text-secondary" title="Filtrar"><i
                                class="bi bi-funnel-fill"></i></button>
                        <button class="btn btn-dark border-secondary text-secondary" title="Visualização em Grade"><i
                                class="bi bi-grid"></i></button>
                        <button class="btn btn-dark border-secondary text-secondary" title="Visualização em Lista"><i
                                class="bi bi-list-task"></i></button>
                    </div>
                </div>
                <div id="document-cards-container" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                    <!-- Document cards will be injected here by JavaScript -->
                </div>
            </div>

            <!-- Import Document View (Nova) -->
            <div id="import-document-view" class="import-document-view d-none">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="mb-0">Importar Documento</h2>
                    <button class="tutorial-help-icon" title="Ajuda sobre importação" data-tutorial="document-import">
                        <i class="bi bi-question-circle"></i>
                    </button>
                </div>
                
                <!-- Tabs para diferentes tipos de importação -->
                <div class="mb-4">
                    <ul class="nav nav-tabs nav-fill" id="import-tabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="file-import-tab" data-bs-toggle="tab" data-bs-target="#file-import" type="button" role="tab">
                                <i class="bi bi-file-earmark-arrow-up me-2"></i>Importar Arquivo
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="json-import-tab" data-bs-toggle="tab" data-bs-target="#json-import" type="button" role="tab">
                                <i class="bi bi-filetype-json me-2"></i>Importar JSON
                            </button>
                        </li>
                    </ul>
                </div>
                
                <div class="tab-content" id="import-tab-content">
                    <!-- File Import Tab -->
                    <div class="tab-pane fade show active" id="file-import" role="tabpanel">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="import-card p-4 bg-dark rounded shadow border border-secondary">
                                    <h4 class="mb-3">Selecionar Arquivo</h4>
                                    
                                    <!-- Drag & Drop Area -->
                                    <div class="file-drop-area border border-secondary border-2 border-dashed rounded p-4 text-center mb-3" id="file-drop-area">
                                        <i class="bi bi-cloud-arrow-up display-1 text-secondary mb-3"></i>
                                        <p class="text-light mb-2">Arraste e solte seu arquivo aqui</p>
                                        <p class="text-muted small">ou</p>
                                        <button class="btn btn-outline-primary" id="select-file-btn">
                                            <i class="bi bi-folder2-open me-2"></i>Selecionar Arquivo
                                        </button>
                                    </div>
                                    
                                    <!-- File Input -->
                                    <input type="file" id="file-import-input" class="d-none" accept=".pdf,.doc,.docx,.html,.htm,.txt,.md,.markdown,.rtf">
                                    
                                    <!-- Supported Types -->
                                    <div class="supported-types mt-3">
                                        <h6 class="text-light">Tipos de Arquivo Suportados:</h6>
                                        <div class="row">
                                            <div class="col-6">
                                                <small class="text-muted">
                                                    <i class="bi bi-file-earmark-pdf me-1"></i> PDF<br>
                                                    <i class="bi bi-file-earmark-word me-1"></i> Word (.docx, .doc)<br>
                                                    <i class="bi bi-file-earmark-text me-1"></i> Texto (.txt)
                                                </small>
                                            </div>
                                            <div class="col-6">
                                                <small class="text-muted">
                                                    <i class="bi bi-file-earmark-code me-1"></i> HTML (.html, .htm)<br>
                                                    <i class="bi bi-markdown me-1"></i> Markdown (.md)<br>
                                                    <i class="bi bi-file-earmark-richtext me-1"></i> RTF (.rtf)
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- File Info -->
                                    <div id="file-info" class="file-info mt-3 p-3 bg-secondary bg-opacity-25 rounded d-none">
                                        <h6 class="text-light">Arquivo Selecionado:</h6>
                                        <div class="d-flex align-items-center">
                                            <i class="file-icon me-2"></i>
                                            <div>
                                                <strong class="file-name"></strong><br>
                                                <small class="text-muted file-details"></small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Processing Options -->
                                    <div id="processing-options" class="processing-options mt-3 d-none">
                                        <h6 class="text-light">Opções de Processamento:</h6>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="preserve-formatting" checked>
                                            <label class="form-check-label text-light" for="preserve-formatting">
                                                Preservar formatação
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="extract-images" checked>
                                            <label class="form-check-label text-light" for="extract-images">
                                                Extrair imagens
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="process-links" checked>
                                            <label class="form-check-label text-light" for="process-links">
                                                Processar links
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <!-- Import Button -->
                                    <button class="btn btn-primary w-100 mt-3" id="process-file-btn" disabled>
                                        <i class="bi bi-gear me-2"></i>Processar Arquivo
                                    </button>
                                    
                                    <!-- Status de processamento -->
                                    <div id="processing-message" class="mt-2 d-none">
                                        <div class="alert alert-info">
                                            <i class="bi bi-gear-fill spin"></i> Processando arquivo...
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="import-card p-4 bg-dark rounded shadow border border-secondary">
                                    <h4 class="mb-3">Preview</h4>
                                    
                                    <!-- Preview Area -->
                                    <div id="file-preview" class="file-preview border border-secondary rounded p-3" style="min-height: 400px; max-height: 400px; overflow-y: auto;">
                                        <div class="preview-placeholder text-center py-5">
                                            <i class="bi bi-eye display-1 text-secondary"></i>
                                            <p class="text-muted">Selecione um arquivo para visualizar o preview</p>
                                        </div>
                                    </div>
                                    
                                    <!-- File Stats -->
                                    <div id="file-stats" class="file-stats mt-3 d-none">
                                        <h6 class="text-light">Estatísticas:</h6>
                                        <div class="row">
                                            <div class="col-4">
                                                <small class="text-muted">Caracteres</small><br>
                                                <strong class="stats-characters">0</strong>
                                            </div>
                                            <div class="col-4">
                                                <small class="text-muted">Palavras</small><br>
                                                <strong class="stats-words">0</strong>
                                            </div>
                                            <div class="col-4">
                                                <small class="text-muted">Linhas</small><br>
                                                <strong class="stats-lines">0</strong>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Processing Status -->
                                    <div id="processing-status" class="processing-status mt-3 d-none">
                                        <div class="d-flex align-items-center">
                                            <div class="spinner-border spinner-border-sm me-2" role="status">
                                                <span class="visually-hidden">Processando...</span>
                                            </div>
                                            <span class="text-light">Processando arquivo...</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Import Final Button -->
                                    <button class="btn btn-success w-100 mt-3" id="confirm-file-import-btn" disabled>
                                        <i class="bi bi-check-circle me-2"></i>Importar Documento
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- JSON Import Tab -->
                    <div class="tab-pane fade" id="json-import" role="tabpanel">
                        <div class="import-card p-4 bg-dark rounded shadow border border-secondary" style="max-width:600px;margin:0 auto;">
                            <label for="import-json-textarea" class="form-label text-light">Cole ou edite o JSON do documento:</label>
                            <textarea id="import-json-textarea" class="form-control bg-dark text-white border-secondary mb-3" rows="10" placeholder="Cole aqui o JSON do documento..."></textarea>
                            <button class="btn btn-primary w-100 mb-2" id="validate-import-json-btn"><i class="bi bi-search"></i> Visualizar/Validar</button>
                            <div id="import-json-preview" class="bg-secondary bg-opacity-10 rounded p-3 mb-3 d-none" style="font-family:monospace;white-space:pre-wrap;word-break:break-all;"></div>
                            <button class="btn btn-success w-100" id="confirm-import-json-btn" disabled><i class="bi bi-check-circle"></i> Importar Documento</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Settings View (New Content) -->
            <div id="settings-view" class="settings-view d-none">
                <h2 class="mb-4">Configurações</h2>

                <div class="settings-card">
                    <h4><i class="bi bi-hdd-fill me-2"></i> Armazenamento Local</h4>
                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="settings-auto-save-toggle">
                        <label class="form-check-label" for="settings-auto-save-toggle">Ativar Auto-Salvar</label>
                    </div>
                    <button class="btn btn-outline-danger" id="clear-all-documents-btn">
                        <i class="bi bi-trash-fill me-2"></i> Limpar Todos os Documentos Locais
                    </button>
                    <p class="settings-status-text mt-2 text-muted">Todos os documentos são salvos localmente no
                        armazenamento do seu navegador.</p>
                </div>


                <div class="settings-card">
                    <h4><i class="bi bi-file-earmark-arrow-down-fill me-2"></i> Exportar Documentos</h4>
                    <button class="btn btn-primary" id="export-all-documents-btn">
                        <i class="bi bi-download me-2"></i> Exportar Todos os Documentos (JSON)
                    </button>
                    <p class="settings-status-text mt-2 text-muted">Baixe todos os seus documentos como um único arquivo
                        JSON para backup ou transferência.</p>
                </div>

                <div class="settings-card">
                    <h4><i class="bi bi-file-earmark-arrow-up-fill me-2"></i> Importar Documentos</h4>
                    <input type="file" class="form-control mb-2 bg-dark text-white border-secondary"
                        id="import-documents-input" accept=".json">
                    <button class="btn btn-primary" id="import-documents-btn" disabled>
                        <i class="bi bi-upload me-2"></i> Importar Documentos
                    </button>
                    <p class="settings-status-text mt-2 text-muted">Carregue um arquivo JSON contendo documentos para
                        importá-los para o aplicativo.</p>
                </div>
            </div>

            <!-- Export Document View (Nova) -->
            <div id="export-document-view" class="export-document-view d-none">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="mb-0">Exportar Documento</h2>
                    <button class="tutorial-help-icon" title="Ajuda sobre exportação" data-tutorial="document-export">
                        <i class="bi bi-question-circle"></i>
                    </button>
                </div>
                
                <div class="row">
                    <!-- Painel de Configurações -->
                    <div class="col-md-4">
                        <div class="export-config-panel bg-dark rounded shadow border border-secondary p-4">
                            <h4 class="mb-3"><i class="bi bi-gear me-2"></i>Configurações de Exportação</h4>
                            
                            <!-- Seleção de Formato -->
                            <div class="mb-4">
                                <label class="form-label text-light">Formato de Exportação</label>
                                <select class="form-select bg-dark border-secondary text-white" id="export-format-select">
                                    <option value="pdf">PDF</option>
                                    <option value="docx">Word (.docx)</option>
                                    <option value="html">HTML</option>
                                    <option value="txt">Texto Puro</option>
                                    <option value="md">Markdown</option>
                                </select>
                            </div>
                            
                            <!-- Configurações de PDF -->
                            <div id="pdf-config" class="export-format-config">
                                <h6 class="text-light mb-3">Configurações PDF</h6>
                                <div class="mb-3">
                                    <label class="form-label text-light">Tamanho da Página</label>
                                    <select class="form-select bg-dark border-secondary text-white" id="pdf-page-size">
                                        <option value="a4">A4</option>
                                        <option value="letter">Letter</option>
                                        <option value="legal">Legal</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-light">Orientação</label>
                                    <select class="form-select bg-dark border-secondary text-white" id="pdf-orientation">
                                        <option value="portrait">Retrato</option>
                                        <option value="landscape">Paisagem</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-light">Tema da Página</label>
                                    <select class="form-select bg-dark border-secondary text-white" id="pdf-theme">
                                        <option value="light">Claro (Branco)</option>
                                        <option value="dark" selected>Escuro (CROM Dark)</option>
                                        <option value="custom">Personalizado</option>
                                    </select>
                                </div>
                                <div class="mb-3 d-none" id="pdf-custom-color-container">
                                    <label class="form-label text-light">Cor de Fundo Personalizada</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control form-control-color bg-dark border-secondary" id="pdf-custom-color" value="#1C1F23">
                                        <input type="text" class="form-control bg-dark border-secondary text-white" id="pdf-custom-color-text" value="#1C1F23" placeholder="#1C1F23">
                                    </div>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="pdf-include-metadata" checked>
                                    <label class="form-check-label text-light" for="pdf-include-metadata">
                                        Incluir metadados do documento
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Configurações de Word -->
                            <div id="docx-config" class="export-format-config d-none">
                                <h6 class="text-light mb-3">Configurações Word</h6>
                                <div class="mb-3">
                                    <label class="form-label text-light">Tamanho da Fonte</label>
                                    <select class="form-select bg-dark border-secondary text-white" id="docx-font-size">
                                        <option value="10">10pt</option>
                                        <option value="11">11pt</option>
                                        <option value="12" selected>12pt</option>
                                        <option value="14">14pt</option>
                                    </select>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="docx-include-toc">
                                    <label class="form-check-label text-light" for="docx-include-toc">
                                        Incluir sumário
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Configurações de HTML -->
                            <div id="html-config" class="export-format-config d-none">
                                <h6 class="text-light mb-3">Configurações HTML</h6>
                                <div class="mb-3">
                                    <label class="form-label text-light">Tema da Página</label>
                                    <select class="form-select bg-dark border-secondary text-white" id="html-theme">
                                        <option value="light">Claro (Branco)</option>
                                        <option value="dark" selected>Escuro (CROM Dark)</option>
                                        <option value="custom">Personalizado</option>
                                    </select>
                                </div>
                                <div class="mb-3 d-none" id="html-custom-color-container">
                                    <label class="form-label text-light">Cor de Fundo Personalizada</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control form-control-color bg-dark border-secondary" id="html-custom-color" value="#1C1F23">
                                        <input type="text" class="form-control bg-dark border-secondary text-white" id="html-custom-color-text" value="#1C1F23" placeholder="#1C1F23">
                                    </div>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="html-include-styles" checked>
                                    <label class="form-check-label text-light" for="html-include-styles">
                                        Incluir estilos CSS
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Botão de Exportação -->
                            <button class="btn btn-primary w-100 mb-3" id="export-document-btn">
                                <i class="bi bi-download me-2"></i>Exportar Documento
                            </button>
                            
                            <!-- Seção de Email -->
                            <div class="export-email-section">
                                <h6 class="text-light mb-3"><i class="bi bi-envelope me-2"></i>Enviar por Email</h6>
                                <div class="mb-3">
                                    <input type="email" class="form-control bg-dark border-secondary text-white" 
                                           id="export-email-input" placeholder="exemplo@email.com">
                                </div>
                                <div class="mb-3">
                                    <textarea class="form-control bg-dark border-secondary text-white" 
                                              id="export-email-message" rows="3" 
                                              placeholder="Mensagem adicional (opcional)"></textarea>
                                </div>
                                <button class="btn btn-outline-primary w-100" id="export-email-btn">
                                    <i class="bi bi-send me-2"></i>Enviar por Email
                                </button>
                            </div>
                            
                            <!-- Seção Em Breve -->
                            <div class="export-coming-soon mt-4 p-3 bg-secondary bg-opacity-25 rounded">
                                <h6 class="text-light mb-2">
                                    <i class="bi bi-share me-2"></i>Compartilhamento Público
                                    <span class="badge bg-warning text-dark ms-2">Em Breve</span>
                                </h6>
                                <p class="text-muted small mb-2">
                                    Em breve você poderá compartilhar seus documentos publicamente com links seguros.
                                </p>
                                <button class="btn btn-outline-secondary btn-sm w-100" disabled>
                                    <i class="bi bi-bell me-2"></i>Notificar quando disponível
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Painel de Preview -->
                    <div class="col-md-8">
                        <div class="export-preview-panel bg-dark rounded shadow border border-secondary p-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h4 class="mb-0"><i class="bi bi-eye me-2"></i>Preview</h4>
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-outline-secondary btn-sm" id="preview-zoom-out">
                                        <i class="bi bi-zoom-out"></i>
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary btn-sm" id="preview-zoom-reset">
                                        100%
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary btn-sm" id="preview-zoom-in">
                                        <i class="bi bi-zoom-in"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="export-preview-container">
                                <div id="export-preview-content" class="export-preview-content">
                                    <!-- Preview do documento será renderizado aqui -->
                                    <div class="preview-placeholder text-center py-5">
                                        <i class="bi bi-file-earmark-text display-1 text-secondary"></i>
                                        <p class="text-muted">Selecione um formato para visualizar o preview</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Editor View (Existing Content) -->
            <div id="editor-view" class="document-content-area">
                <div class="document-toolbar mb-0 p-2 d-flex flex-wrap align-items-center justify-content-start gap-2">
                    <!-- Text Formatting -->
                    <button type="button" class="btn btn-dark btn-sm" data-command="bold" title="Negrito"><i
                            class="bi bi-type-bold"></i></button>
                    <button type="button" class="btn btn-dark btn-sm" data-command="italic" title="Itálico"><i
                            class="bi bi-type-italic"></i></button>
                    <button type="button" class="btn btn-dark btn-sm" data-command="underline" title="Sublinhado"><i
                            class="bi bi-type-underline"></i></button>
                    <button type="button" class="btn btn-dark btn-sm" data-command="strikeThrough" title="Tachado"><i
                            class="bi bi-type-strikethrough"></i></button>
                    <div class="vr bg-light mx-1" style="height: 24px;"></div>
                    <!-- Removido: Botão Compartilhar Documento -->
                    <!-- Heading/Paragraph -->
                    <select class="form-select form-select-sm w-auto" id="formatBlockSelect" title="Formato">
                        <option value="p">Parágrafo</option>
                        <option value="h1">Título 1</option>
                        <option value="h2">Título 2</option>
                        <option value="h3">Título 3</option>
                        <option value="h4">Título 4</option>
                        <option value="h5">Título 5</option>
                        <option value="h6">Título 6</option>
                    </select>
                    <div class="vr bg-light mx-1" style="height: 24px;"></div>

                    <!-- Lists -->
                    <button type="button" class="btn btn-dark btn-sm" data-command="insertUnorderedList"
                        title="Lista de Marcadores"><i class="bi bi-list-ul"></i></button>
                    <button type="button" class="btn btn-dark btn-sm" data-command="insertOrderedList"
                        title="Lista Numerada"><i class="bi bi-list-ol"></i></button>
                    <div class="vr bg-light mx-1" style="height: 24px;"></div>

                    <!-- Indent/Outdent -->
                    <button type="button" class="btn btn-dark btn-sm" data-command="indent" title="Aumentar Recuo"><i
                            class="bi bi-arrow-right-square"></i></button>
                    <button type="button" class="btn btn-dark btn-sm" data-command="outdent" title="Diminuir Recuo"><i
                            class="bi bi-arrow-left-square"></i></button>
                    <div class="vr bg-light mx-1" style="height: 24px;"></div>

                    <!-- Alignment -->
                    <button type="button" class="btn btn-dark btn-sm" data-command="justifyLeft"
                        title="Alinhar à Esquerda"><i class="bi bi-text-left"></i></button>
                    <button type="button" class="btn btn-dark btn-sm" data-command="justifyCenter"
                        title="Alinhar ao Centro"><i class="bi bi-text-center"></i></button>
                    <button type="button" class="btn btn-dark btn-sm" data-command="justifyRight"
                        title="Alinhar à Direita"><i class="bi bi-text-right"></i></button>
                    <button type="button" class="btn btn-dark btn-sm" data-command="justifyFull" title="Justificar"><i
                            class="bi bi-justify"></i></button>
                    <div class="vr bg-light mx-1" style="height: 24px;"></div>

                    <!-- Links -->
                    <button type="button" class="btn btn-dark btn-sm" data-command="createLink" title="Inserir Link"><i
                            class="bi bi-link-45deg"></i></button>
                    <button type="button" class="btn btn-dark btn-sm" data-command="unlink" title="Remover Link"><i
                            class="bi bi-link"></i></button>
                    <div class="vr bg-light mx-1" style="height: 24px;"></div>

                    <!-- Clear Formatting -->
                    <button type="button" class="btn btn-dark btn-sm" data-command="removeFormat"
                        title="Limpar Formatação"><i class="bi bi-eraser"></i></button>
                    
                    <!-- Tutorial Help Icon -->
                    <button type="button" class="tutorial-help-icon" title="Ajuda sobre a barra de ferramentas" data-tutorial="editor-toolbar">
                        <i class="bi bi-question-circle"></i>
                    </button>
                </div>
                <div class="document-editor" contenteditable="true" data-document-id="default">
                    <!-- Initial content will be managed by JS -->
                </div>
            </div>
        </main>

    </div>

    <!-- Tutorial Panel (Lateral Direita) -->
    <div id="tutorial-panel" class="tutorial-panel">
        <div class="tutorial-header">
            <h4><i class="bi bi-question-circle me-2"></i>Tutorial</h4>
            <button id="tutorial-close-btn" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
        <div class="tutorial-content">
            <div id="tutorial-general" class="tutorial-section">
                <h5>Bem-vindo ao CROM Docs</h5>
                <div class="tutorial-info-card">
                    <div class="tutorial-info-header">
                        <i class="bi bi-info-circle-fill me-2"></i>
                        <span>O que é o CROM Docs?</span>
                        <button class="btn btn-sm btn-link text-white tutorial-minimize-btn" data-target="info-about">
                            <i class="bi bi-dash"></i>
                        </button>
                    </div>
                    <div class="tutorial-info-content" id="info-about">
                        <p>O CROM Docs é um editor de documentos moderno e elegante, similar ao Google Docs e Notion, com as seguintes características:</p>
                        <ul>
                            <li><strong>Privacidade Total:</strong> Todos os documentos são salvos localmente no seu navegador</li>
                            <li><strong>Editor Rico:</strong> Suporte a formatação avançada, títulos, listas, links</li>
                            <li><strong>Organização:</strong> Categorias, etiquetas e busca inteligente</li>
                            <li><strong>Exportação:</strong> Exporte seus documentos em JSON ou compartilhe via link</li>
                            <li><strong>Tema Escuro:</strong> Interface moderna otimizada para produtividade</li>
                        </ul>
                    </div>
                </div>
                
                <div class="tutorial-info-card">
                    <div class="tutorial-info-header">
                        <i class="bi bi-keyboard me-2"></i>
                        <span>Atalhos de Teclado</span>
                        <button class="btn btn-sm btn-link text-white tutorial-minimize-btn" data-target="info-shortcuts">
                            <i class="bi bi-dash"></i>
                        </button>
                    </div>
                    <div class="tutorial-info-content" id="info-shortcuts">
                        <div class="shortcut-grid">
                            <div class="shortcut-item"><kbd>Ctrl + B</kbd> <span>Negrito</span></div>
                            <div class="shortcut-item"><kbd>Ctrl + I</kbd> <span>Itálico</span></div>
                            <div class="shortcut-item"><kbd>Ctrl + U</kbd> <span>Sublinhado</span></div>
                            <div class="shortcut-item"><kbd>Ctrl + S</kbd> <span>Salvar</span></div>
                            <div class="shortcut-item"><kbd>Ctrl + Z</kbd> <span>Desfazer</span></div>
                            <div class="shortcut-item"><kbd>Ctrl + Y</kbd> <span>Refazer</span></div>
                        </div>
                    </div>
                </div>
                
                <div class="tutorial-info-card">
                    <div class="tutorial-info-header">
                        <i class="bi bi-lightbulb me-2"></i>
                        <span>Dicas Rápidas</span>
                        <button class="btn btn-sm btn-link text-white tutorial-minimize-btn" data-target="info-tips">
                            <i class="bi bi-dash"></i>
                        </button>
                    </div>
                    <div class="tutorial-info-content" id="info-tips">
                        <ul>
                            <li>Use as categorias para organizar seus documentos por projeto ou tipo</li>
                            <li>Adicione etiquetas para facilitar a busca posterior</li>
                            <li>O auto-salvamento mantém seu trabalho sempre seguro</li>
                            <li>Clique com o botão direito nos documentos para ver mais opções</li>
                            <li>Use o dashboard para ter uma visão geral de todos os seus documentos</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div id="tutorial-specific" class="tutorial-section d-none">
                <h5>Tutorial Específico</h5>
                <div id="tutorial-specific-content">
                    <!-- Conteúdo específico será inserido aqui -->
                </div>
            </div>
        </div>
    </div>

    <button id="sidebar-floating-toggle" type="button" title="Mostrar/Ocultar Barra Lateral"
        aria-label="Alternar barra lateral">
        <i class="bi bi-layout-sidebar"></i>
    </button>

    <!-- Document Properties Modal -->
    <div class="modal fade" id="document-properties-modal" tabindex="-1" aria-labelledby="documentPropertiesModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark border border-secondary">
                <div class="modal-header border-bottom border-secondary">
                    <h5 class="modal-title" id="documentPropertiesModalLabel">Editar Propriedades do Documento</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="edit-doc-id">
                    <div class="mb-3">
                        <label for="document-name-input" class="form-label text-light">Nome do Documento</label>
                        <input type="text" class="form-control bg-dark border-secondary text-white"
                            id="document-name-input">
                    </div>
                    <div class="mb-3">
                        <label for="document-category-input" class="form-label text-light">Categoria</label>
                        <input type="text" class="form-control bg-dark border-secondary text-white"
                            id="document-category-input" placeholder="ex: Fluxos de Trabalho, Pessoal">
                    </div>
                    <div class="mb-3">
                        <label for="document-tags-input" class="form-label text-light">Etiquetas (separadas por
                            vírgula)</label>
                        <input type="text" class="form-control bg-dark border-secondary text-white"
                            id="document-tags-input" placeholder="ex: projeto, reunião, tarefa">
                        <div class="form-text text-muted">Separe múltiplas etiquetas com vírgulas (ex: "urgente,
                            brainstorming").</div>
                    </div>
                </div>
                <div class="modal-footer border-top border-secondary">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="save-properties-btn">Salvar Alterações</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS (bundle includes Popper) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" crossorigin="anonymous"></script>
    <!-- Bootstrap Icons (optional, but good for Notion-like UI) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- SweetAlert2 (Dark Theme) -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@5/dark.min.css">
    
    <!-- Export Libraries -->
    <!-- jsPDF for PDF export -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <!-- docx for DOCX export -->
    <script src="https://unpkg.com/docx@8.5.0/build/index.js"></script>
    <!-- html2canvas for PDF generation (optional) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

    <!-- Import Map for future JS modules -->
    <script type="importmap">
        {
            "imports": {
                "lib/": "/js/lib/",
                "modules/": "/js/modules/",
                "utils/": "/js/utils/",
                "systems/": "/js/systems/",
                "managers/": "/js/managers/",
                "config/": "/js/config/"
            }
        }
    </script>
    <script type="module" src="/js/main.js"></script>
    <script>
        // Debug para verificar se o JavaScript está funcionando
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM carregado');
            
            // Teste básico de clique no menu
            const menuNewDocument = document.getElementById('menu-new-document');
            if (menuNewDocument) {
                console.log('Menu novo documento encontrado');
                menuNewDocument.addEventListener('click', function(e) {
                    console.log('Clique no menu novo documento detectado');
                    e.preventDefault();
                });
            } else {
                console.log('Menu novo documento não encontrado');
            }
        });
        
        // Sidebar floating toggle logic melhorado
        document.addEventListener('DOMContentLoaded', function () {
            const mainLayout = document.getElementById('main-layout-container');
            const sidebarToggle = document.getElementById('sidebar-floating-toggle');
            // Estado inicial do botão
            function updateToggleVisibility() {
                if (mainLayout.classList.contains('sidebar-hidden')) {
                    sidebarToggle.setAttribute('aria-pressed', 'false');
                } else {
                    sidebarToggle.setAttribute('aria-pressed', 'true');
                }
            }
            updateToggleVisibility();
            sidebarToggle.addEventListener('click', function () {
                mainLayout.classList.toggle('sidebar-hidden');
                updateToggleVisibility();
            });
            // Atualiza visibilidade ao redimensionar ou mudar manualmente
            window.addEventListener('resize', updateToggleVisibility);
        });
    </script>
</body>

</html>