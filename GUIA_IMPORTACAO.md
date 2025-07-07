# Como Usar a Importação de Arquivos - CROM Docs

## Guia do Usuário

### 1. Acessando a Importação

Para importar arquivos no CROM Docs:

1. **No Menu Lateral**: Clique em "Importar Documento" na barra lateral
2. **No Menu Superior**: Vá em "Arquivo" → "Importar Documento"

### 2. Tipos de Importação

O sistema oferece duas opções:

#### A) Importar Arquivo
- Suporta PDF, Word, HTML, Texto, Markdown e RTF
- Interface de arrastar e soltar
- Preview antes da importação

#### B) Importar JSON
- Para documentos já em formato JSON do CROM Docs
- Ideal para backup e restauração

### 3. Importando Arquivos

#### Passo 1: Selecionar Arquivo
- **Arraste e solte** o arquivo na área indicada
- OU **clique em "Selecionar Arquivo"** para abrir o navegador

#### Passo 2: Configurar Opções
- **Preservar formatação**: Mantém estilos originais
- **Extrair imagens**: Inclui imagens do documento
- **Processar links**: Converte links clicáveis

#### Passo 3: Processar
- Clique em **"Processar Arquivo"**
- Aguarde o processamento (pode demorar para arquivos grandes)
- Veja o preview do resultado

#### Passo 4: Importar
- Clique em **"Importar Documento"**
- O documento será criado na categoria "Importados"
- Você será redirecionado para o editor

### 4. Formatos Suportados

#### 📄 PDF
- ✅ Texto e parágrafos
- ✅ Metadados (título, autor)
- ❌ Imagens e gráficos
- ❌ Tabelas complexas

#### 📝 Word (.docx, .doc)
- ✅ Texto e formatação
- ✅ Imagens (convertidas para base64)
- ✅ Títulos e estilos
- ⚠️ Algumas formatações complexas podem ser perdidas

#### 🌐 HTML
- ✅ Texto e formatação
- ✅ Links e imagens
- ✅ Listas e tabelas
- ⚠️ Scripts e elementos perigosos são removidos

#### 📃 Texto (.txt)
- ✅ Texto simples
- ✅ Detecção automática de títulos
- ✅ Conversão de quebras de linha
- ❌ Formatação limitada

#### 📖 Markdown (.md)
- ✅ Conversão completa para HTML
- ✅ Sintaxe destacada
- ✅ Metadados (front matter)
- ✅ Tabelas e listas

#### 📄 RTF
- ✅ Texto básico
- ⚠️ Formatação limitada
- ❌ Imagens não suportadas

### 5. Limites e Restrições

- **Tamanho máximo**: 10MB por arquivo
- **Tipos suportados**: Apenas os listados acima
- **Processamento**: Pode demorar para arquivos grandes
- **Imagens**: Convertidas para base64 (aumenta tamanho)

### 6. Dicas e Boas Práticas

#### Para Melhores Resultados:
1. **PDFs**: Use arquivos com texto selecionável (não scaneados)
2. **Word**: Evite formatações muito complexas
3. **HTML**: Prefira HTML limpo e bem estruturado
4. **Markdown**: Use sintaxe padrão

#### Organizando Documentos:
1. **Categorias**: Documentos importados vão para "Importados"
2. **Etiquetas**: São adicionadas automaticamente
3. **Título**: Extraído automaticamente quando possível
4. **Edição**: Você pode editar após importar

### 7. Solução de Problemas

#### Arquivo Não Suportado
- Verifique se o formato está na lista de suportados
- Tente converter o arquivo para um formato suportado
- Use a importação JSON para documentos do CROM Docs

#### Arquivo Muito Grande
- Comprima o arquivo se possível
- Remova imagens desnecessárias
- Divida em arquivos menores

#### Formatação Perdida
- Alguns formatos têm limitações
- Use o editor para reformatar após importar
- Considere usar Markdown para melhor controle

#### Erro de Processamento
- Verifique se o arquivo não está corrompido
- Tente com um arquivo menor primeiro
- Atualize a página e tente novamente

### 8. Exemplos Práticos

#### Importando um PDF
1. Abra a importação de arquivos
2. Arraste seu PDF para a área
3. Mantenha "Preservar formatação" marcado
4. Clique em "Processar Arquivo"
5. Revise o preview
6. Clique em "Importar Documento"

#### Importando um Word
1. Selecione seu arquivo .docx
2. Marque "Extrair imagens" se necessário
3. Processe o arquivo
4. Verifique se as imagens foram incluídas
5. Importe o documento

#### Importando Markdown
1. Selecione seu arquivo .md
2. O sistema detectará automaticamente títulos e formatação
3. Front matter será processado como metadados
4. Links serão convertidos automaticamente

### 9. Backup e Restauração

#### Fazendo Backup
1. Vá em "Configurações"
2. Clique em "Exportar Todos os Documentos"
3. Salve o arquivo JSON gerado

#### Restaurando do Backup
1. Vá em "Importar Documento"
2. Selecione a aba "Importar JSON"
3. Cole o conteúdo do backup
4. Clique em "Importar Documento"

### 10. FAQ

**P: Posso importar múltiplos arquivos?**
R: Atualmente não, mas está planejado para versões futuras.

**P: As imagens ficam muito grandes?**
R: Sim, imagens são convertidas para base64. Considere otimizar antes de importar.

**P: Posso importar do Google Docs?**
R: Exporte como .docx ou .html primeiro, depois importe.

**P: E arquivos Excel?**
R: Não suportado diretamente. Salve como HTML ou copie o texto.

**P: Como importar de outros editores?**
R: Use os formatos de exportação disponíveis (HTML, Markdown, etc.).

### 11. Suporte

Se encontrar problemas:
1. Verifique se o arquivo está dentro dos limites
2. Tente com um arquivo menor
3. Consulte os logs do navegador (F12)
4. Reporte problemas específicos

O sistema está em constante evolução e novos formatos serão adicionados conforme a demanda.
