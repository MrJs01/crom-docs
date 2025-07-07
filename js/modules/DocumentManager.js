export class DocumentManager {
    constructor() {
        this.STORAGE_KEY_PREFIX = 'document_app_doc_';
        this.LAST_OPENED_DOC_KEY = 'document_app_last_opened';
        // Removido: não chama mais ensureDefaultDocuments automaticamente
    }

    // Default documents to populate if local storage is empty
    DEFAULT_DOCUMENTS = {
        'my-first-document': {
            name: 'Meu Primeiro Documento',
            category: 'Fluxos de Trabalho',
            tags: ['introducao', 'documentacao'],
            content: `<h1>Bem-vindo ao Seu Novo Documento!</h1>
                    <p class="lead">Comece a digitar para criar conteúdo incrível. Este editor foi projetado para oferecer uma experiência de escrita limpa e focada, semelhante ao Google Docs ou Notion.</p>

                    <h2>Principais Recursos</h2>
                    <ul>
                        <li><strong>Edição de Texto Rico:</strong> Negrito, itálico, sublinhado, criar listas e muito mais.</li>
                        <li><strong>Espaço de Trabalho Organizado:</strong> Gerencie facilmente seus documentos na barra lateral.</li>
                        <li><strong>Tema Escuro:</strong> Desfrute de uma experiência de visualização confortável.</li>
                    </ul>

                    <h3>Primeiros Passos</h3>
                    <p>Basta clicar em qualquer lugar nesta área e começar a escrever. Você pode usar atalhos de teclado padrão para formatação. Por exemplo, tente selecionar algum texto e pressionar <code>Ctrl+B</code> (ou <code>Cmd+B</code> no Mac) para deixá-lo em negrito.</p>

                    <h4>Exemplos de Conteúdo</h4>
                    <p>Aqui está um parágrafo simples para demonstrar o texto básico. Você pode adicionar estruturas mais complexas, como tabelas ou blocos de código, conforme necessário.</p>

                    <pre><code class="language-javascript">
function helloWorld() {
    console.log("Olá, DocumentApp!");
}

helloWorld();
                    </code></pre>

                    <h5>Notas Importantes</h5>
                    <p>Lembre-se de salvar seu trabalho com frequência, embora os recursos de salvamento automático estejam planejados para futuras atualizações. Seus documentos são armazenados localmente por enquanto, proporcionando um espaço de escrita rápido e privado.</p>

                    <p>Obrigado por usar o DocumentApp. Esperamos que você goste de criar conosco!</p>`
        },
        'project-alpha-notes': {
            name: 'Notas do Projeto Alpha',
            category: 'Fluxos de Trabalho',
            tags: ['projeto', 'equipe'],
            content: `<h1>Projeto Alpha: Brainstorm Inicial</h1>
                    <p>Este documento contém nossas notas preliminares para o Projeto Alpha. Nosso objetivo é revolucionar os fluxos de trabalho de análise de dados.</p>
                    <h2>Marcos</h2>
                    <ul>
                        <li>Fase 1: Pesquisa e conceituação</li>
                        <li>Fase 2: Desenvolvimento do protótipo</li>
                        <li>Fase 3: Teste de usuário e feedback</li>
                    </ul>
                    <h3>Membros da Equipe</h3>
                    <p>João Ninguém, Maria Silva, Alex Souza</p>`
        },
        'meeting-minutes-2024-07-20': {
            name: 'Ata da Reunião - 2024-07-20',
            category: 'Fluxos de Trabalho',
            tags: ['reuniao', 'relatorio'],
            content: `<h1>Ata da Reunião: Sincronização do Produto</h1>
                    <p><strong>Data:</strong> 20 de julho de 2024</p>
                    <p><strong>Participantes:</strong> Todos os membros da equipe de produto</p>
                    <h2>Pontos de Discussão</h2>
                    <ul>
                        <li>Revisão do roteiro do terceiro trimestre.</li>
                        <li>Discussão do feedback do usuário sobre o novo painel.</li>
                        <li>Planejamento das tarefas do próximo sprint.</li>
                    </ul>
                    <h3>Itens de Ação</h3>
                    <p><strong>João:</strong> Atualizar a documentação da persona do usuário.</p>
                    <p><strong>Maria:</strong> Preparar o relatório de desempenho do terceiro trimestre.</p>`
        },
        'api-credentials-v1': {
            name: 'Credenciais de API V1',
            category: 'Credenciais',
            tags: ['api', 'seguranca'],
            content: `<h1>Credenciais de API - Versão 1</h1><p>Armazene suas chaves de API com segurança aqui. Lembre-se de atualizar regularmente.</p>`
        },
        'daily-execution-log': {
            name: 'Registro de Execução Diária',
            category: 'Execuções',
            tags: ['log', 'diario'],
            content: `<h1>Registro Diário - 2024-07-25</h1><p>Registro de execuções e resultados diários do sistema.</p>`
        },
        'onboarding-guide': {
            name: 'Guia de Integração de Novo Funcionário',
            category: 'Recursos Humanos',
            tags: ['rh', 'integracao'],
            content: `<h1>Integração de Novo Funcionário</h1><p>Este guia descreve os passos para novos funcionários.</p>`
        },
        'marketing-strategy-2024': {
            name: 'Estratégia de Marketing 2024',
            category: 'Marketing',
            tags: ['estrategia', 'campanha'],
            content: `<h1>Plano de Marketing 2024</h1><p>Principais iniciativas para os esforços de marketing do próximo ano.</p>`
        }
    };

    ensureDefaultDocuments() {
        const docList = this.getDocumentsList();
        if (docList.length === 0) {
            for (const id in this.DEFAULT_DOCUMENTS) {
                const doc = this.DEFAULT_DOCUMENTS[id];
                this.saveDocument(id, doc.content, doc.name, doc.category, doc.tags);
            }
            this.setLastOpenedDocument('my-first-document');
        }
        // Só executa se chamado explicitamente
    }

    saveDocument(id, content, name = null, category = null, tags = null) {
        let docData;
        try {
            const existing = localStorage.getItem(this.STORAGE_KEY_PREFIX + id);
            docData = existing ? JSON.parse(existing) : { id: id, name: name || ` ${Date.now()}` };
        } catch (e) {
            console.error("Erro ao analisar dados de documento existentes:", e);
            docData = { id: id, name: name || ` ${Date.now()}` };
        }
        
        docData.content = content;
        docData.lastModified = new Date().toISOString();
        // Set 'created' only if it doesn't exist (i.e., new document)
        if (!docData.created) {
            docData.created = docData.lastModified;
        }

        // Update properties if provided, otherwise keep existing
        docData.name = name !== null ? name : docData.name;
        docData.category = category !== null ? category : (docData.category || 'Sem Categoria');
        docData.tags = tags !== null ? tags : (docData.tags || []);

        localStorage.setItem(this.STORAGE_KEY_PREFIX + id, JSON.stringify(docData));
        this.setLastOpenedDocument(id);
    }

    loadDocument(id) {
        const docData = localStorage.getItem(this.STORAGE_KEY_PREFIX + id);
        return docData ? JSON.parse(docData) : null;
    }

    getDocumentsList() {
        const documents = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
                try {
                    const docData = JSON.parse(localStorage.getItem(key));
                    documents.push({
                        id: docData.id,
                        name: docData.name,
                        lastModified: docData.lastModified,
                        created: docData.created || docData.lastModified, // Fallback for old documents
                        category: docData.category || 'Sem Categoria', // Default category
                        tags: docData.tags || [], // Default tags
                        content: docData.content || '' // Incluir content para contagem de palavras
                    });
                } catch (e) {
                    console.error("Erro ao analisar documento do armazenamento:", key, e);
                }
            }
        }
        // No default sorting here; sorting will be handled by the UI
        return documents;
    }

    // New method to get all document data including content for export
    getAllDocuments() {
        const documents = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
                try {
                    const docData = JSON.parse(localStorage.getItem(key));
                    documents.push(docData);
                } catch (e) {
                    console.error("Erro ao analisar documento do armazenamento para exportação:", key, e);
                }
            }
        }
        return documents;
    }

    createDocument(name = null, category = 'Sem Categoria', tags = []) {
        const newId = `doc-${Date.now()}`;
        const newName = name || ` ${this.getDocumentsList().length + 1}`;
        const initialContent = `<h1>${newName}</h1><p>Comece a escrever seu novo documento aqui...</p>`;
        const createdDate = new Date().toISOString(); // Store creation date
        const docData = {
            id: newId,
            name: newName,
            content: initialContent,
            created: createdDate,
            lastModified: createdDate,
            category: category,
            tags: tags
        };
        localStorage.setItem(this.STORAGE_KEY_PREFIX + newId, JSON.stringify(docData));
        this.setLastOpenedDocument(newId);
        return docData;
    }

    // New method for importing documents (creates a new entry with potentially new ID)
    importDocument(docData) {
        // Ensure new ID to prevent accidental overwrites and enforce uniqueness on import
        const newId = `doc-imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const importedDoc = {
            id: newId,
            name: docData.name || `Documento Importado ${Date.now()}`,
            content: docData.content || '',
            created: docData.created || new Date().toISOString(),
            lastModified: new Date().toISOString(), // Set last modified to now on import
            category: docData.category || 'Sem Categoria',
            tags: docData.tags || []
        };
        localStorage.setItem(this.STORAGE_KEY_PREFIX + newId, JSON.stringify(importedDoc));
        return importedDoc;
    }

    deleteDocument(id) {
        localStorage.removeItem(this.STORAGE_KEY_PREFIX + id);
        // If the deleted document was the last opened, clear that key
        if (this.getLastOpenedDocument() === id) {
            this.setLastOpenedDocument(null);
        }
    }

    // New method to clear all documents from local storage
    clearAllDocuments() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        this.setLastOpenedDocument(null); // Clear last opened document
        // Não recria mais documentos padrão automaticamente
    }

    getLastOpenedDocument() {
        return localStorage.getItem(this.LAST_OPENED_DOC_KEY);
    }

    setLastOpenedDocument(id) {
        if (id) {
            localStorage.setItem(this.LAST_OPENED_DOC_KEY, id);
        } else {
            localStorage.removeItem(this.LAST_OPENED_DOC_KEY);
        }
    }

    // New method to get all unique categories
    getAllCategories() {
        const documents = this.getDocumentsList();
        const categories = new Set();
        documents.forEach(doc => {
            categories.add(doc.category || 'Sem Categoria');
        });
        return Array.from(categories).sort();
    }
}