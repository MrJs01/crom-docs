/**
 * Exemplo de uso do sistema de importação de arquivos
 * Este script demonstra como usar o FileImportManager
 */

// Importar o gerenciador de importação
import FileImportManager from './js/managers/FileImportManager.js';
import { formatFileSize, getFileIcon, validateFile } from './js/utils/fileUtils.js';

// Exemplo de uso básico
async function exemploBasico() {
    console.log('=== Exemplo Básico de Importação ===');
    
    const fileImportManager = new FileImportManager();
    
    // Simular arquivo (em um cenário real, viria de um input file)
    const file = new File(['Olá, mundo!'], 'exemplo.txt', { type: 'text/plain' });
    
    try {
        // Verificar se o arquivo é suportado
        if (!fileImportManager.isSupported(file)) {
            console.error('Tipo de arquivo não suportado');
            return;
        }
        
        // Processar arquivo
        const result = await fileImportManager.processFile(file);
        
        if (result.success) {
            console.log('Arquivo processado com sucesso!');
            console.log('Título:', result.title);
            console.log('Conteúdo:', result.content);
            console.log('Metadados:', result.metadata);
        } else {
            console.error('Erro ao processar arquivo:', result.error);
        }
        
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

// Exemplo com validação avançada
async function exemploComValidacao() {
    console.log('\n=== Exemplo com Validação ===');
    
    const fileImportManager = new FileImportManager();
    
    // Simular arquivo
    const file = new File(['# Título\n\nEste é um arquivo Markdown.'], 'exemplo.md', { type: 'text/markdown' });
    
    try {
        // Validar arquivo
        const validation = validateFile(file, {
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['text/markdown', 'text/plain']
        });
        
        if (!validation.valid) {
            console.error('Arquivo inválido:', validation.errors);
            return;
        }
        
        console.log('Arquivo válido!');
        console.log('Nome:', file.name);
        console.log('Tamanho:', formatFileSize(file.size));
        console.log('Ícone:', getFileIcon(file));
        
        // Processar arquivo
        const result = await fileImportManager.processFile(file, {
            preserveFormatting: true,
            extractImages: true,
            processLinks: true
        });
        
        if (result.success) {
            console.log('Processamento concluído!');
            console.log('Tipo detectado:', result.type);
            console.log('HTML gerado:', result.content);
        }
        
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

// Exemplo com múltiplos arquivos
async function exemploMultiplosArquivos() {
    console.log('\n=== Exemplo com Múltiplos Arquivos ===');
    
    const fileImportManager = new FileImportManager();
    
    // Simular múltiplos arquivos
    const arquivos = [
        new File(['Texto simples'], 'texto.txt', { type: 'text/plain' }),
        new File(['<h1>HTML</h1><p>Conteúdo HTML</p>'], 'html.html', { type: 'text/html' }),
        new File(['# Markdown\n\nConteúdo **markdown**'], 'markdown.md', { type: 'text/markdown' })
    ];
    
    const resultados = [];
    
    for (const arquivo of arquivos) {
        try {
            console.log(`\nProcessando: ${arquivo.name}`);
            
            const result = await fileImportManager.processFile(arquivo);
            
            if (result.success) {
                console.log(`✓ ${arquivo.name} processado com sucesso`);
                resultados.push(result);
            } else {
                console.error(`✗ ${arquivo.name} falhou:`, result.error);
            }
            
        } catch (error) {
            console.error(`✗ ${arquivo.name} erro:`, error.message);
        }
    }
    
    console.log(`\nResultados: ${resultados.length} arquivos processados com sucesso`);
}

// Exemplo com preview
async function exemploComPreview() {
    console.log('\n=== Exemplo com Preview ===');
    
    const fileImportManager = new FileImportManager();
    
    // Simular arquivo de texto longo
    const textoLongo = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20);
    const file = new File([textoLongo], 'longo.txt', { type: 'text/plain' });
    
    try {
        // Carregar processador
        await fileImportManager.loadProcessor('txt');
        const processor = fileImportManager.processors.txt;
        
        // Gerar preview
        const preview = await processor.preview(file, 100);
        
        console.log('Preview gerado:');
        console.log('Texto:', preview.preview);
        console.log('Estatísticas:', preview.stats);
        
    } catch (error) {
        console.error('Erro ao gerar preview:', error.message);
    }
}

// Exemplo com tratamento de erro
async function exemploComErros() {
    console.log('\n=== Exemplo com Tratamento de Erros ===');
    
    const fileImportManager = new FileImportManager();
    
    // Simular arquivo com tipo não suportado
    const arquivoInvalido = new File(['dados'], 'arquivo.xyz', { type: 'application/unknown' });
    
    try {
        // Tentar processar arquivo inválido
        const result = await fileImportManager.processFile(arquivoInvalido);
        
        if (!result.success) {
            console.log('Erro esperado capturado:', result.error);
        }
        
    } catch (error) {
        console.log('Exceção capturada:', error.message);
    }
    
    // Arquivo muito grande
    const arquivoGrande = new File(['x'.repeat(20 * 1024 * 1024)], 'grande.txt', { type: 'text/plain' });
    
    const validation = fileImportManager.validateFile(arquivoGrande, 10 * 1024 * 1024);
    
    if (!validation.valid) {
        console.log('Arquivo rejeitado (muito grande):', validation.errors);
    }
}

// Exemplo de informações do sistema
function exemploInformacoes() {
    console.log('\n=== Informações do Sistema ===');
    
    const fileImportManager = new FileImportManager();
    
    // Tipos suportados
    const tiposSuportados = fileImportManager.getSupportedTypes();
    console.log('Tipos suportados:');
    Object.entries(tiposSuportados).forEach(([nome, info]) => {
        console.log(`- ${nome}: ${info.extensions.join(', ')}`);
    });
    
    // Tamanho máximo
    console.log('\nTamanho máximo padrão: 10MB');
    
    // Processadores disponíveis
    console.log('\nProcessadores:');
    console.log('- PDF: PDFProcessor (PDF.js)');
    console.log('- Word: WordProcessor (mammoth.js)');
    console.log('- HTML: HTMLProcessor (nativo)');
    console.log('- Texto: TextProcessor (nativo)');
    console.log('- Markdown: MarkdownProcessor (marked.js)');
    console.log('- RTF: RTFProcessor (customizado)');
}

// Executar exemplos
async function executarExemplos() {
    console.log('🚀 Iniciando exemplos do sistema de importação...\n');
    
    try {
        await exemploBasico();
        await exemploComValidacao();
        await exemploMultiplosArquivos();
        await exemploComPreview();
        await exemploComErros();
        exemploInformacoes();
        
        console.log('\n✅ Todos os exemplos executados com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro durante execução dos exemplos:', error);
    }
}

// Executar se o script for chamado diretamente
if (typeof window !== 'undefined') {
    // Executar no navegador
    document.addEventListener('DOMContentLoaded', executarExemplos);
} else {
    // Executar no Node.js (se suportado)
    executarExemplos();
}

// Exportar funções para uso em outros scripts
export {
    exemploBasico,
    exemploComValidacao,
    exemploMultiplosArquivos,
    exemploComPreview,
    exemploComErros,
    exemploInformacoes,
    executarExemplos
};
