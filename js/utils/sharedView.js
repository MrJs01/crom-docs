// Função para obter parâmetros da URL
export function getUrlParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// Função para mostrar visualização compartilhada
export function showSharedDocumentView(base64Content) {
    // Remove tudo do body e mostra só o conteúdo do documento
    document.body.innerHTML = '';
    document.body.className = 'bg-dark text-white';
    const container = document.createElement('div');
    container.className = 'shared-doc-viewer';
    container.style.maxWidth = '900px';
    container.style.margin = '40px auto';
    container.style.background = '#23272b';
    container.style.borderRadius = '12px';
    container.style.boxShadow = '0 4px 32px #000a';
    container.style.padding = '2.5rem 2rem';
    container.style.color = '#e0e6eb';
    let html = '';
    try {
        html = atob(base64Content);
    } catch (e) {
        html = '<h2>Erro ao decodificar documento.</h2>';
    }
    container.innerHTML = html;
    document.body.appendChild(container);
    document.title = 'Visualização do Documento';
}

// Função para verificar modo de visualização compartilhada
export function checkSharedMode() {
    const sharedDocBase64 = getUrlParam('doc');
    const isViewMode = getUrlParam('view') === '1' && sharedDocBase64;
    
    if (isViewMode) {
        showSharedDocumentView(sharedDocBase64);
        // Não executa mais nada do app
        throw new Error('Modo visualização: execução interrompida.');
    }
}
