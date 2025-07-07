/**
 * fileUtils - Utilitários para trabalhar com arquivos
 */

/**
 * Formata tamanho de arquivo em bytes para formato legível
 */
export function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Obtém extensão de arquivo
 */
export function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

/**
 * Obtém nome do arquivo sem extensão
 */
export function getFileNameWithoutExtension(filename) {
    return filename.split('.').slice(0, -1).join('.');
}

/**
 * Valida tipo de arquivo
 */
export function validateFileType(file, allowedTypes = []) {
    if (!file) return false;
    
    const extension = getFileExtension(file.name);
    const mimeType = file.type;
    
    return allowedTypes.some(type => {
        if (type.startsWith('.')) {
            return type.substring(1) === extension;
        }
        return type === mimeType;
    });
}

/**
 * Converte arquivo para base64
 */
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Erro ao converter arquivo para base64'));
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * Converte arquivo para texto
 */
export function fileToText(file, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Erro ao converter arquivo para texto'));
        };
        
        reader.readAsText(file, encoding);
    });
}

/**
 * Converte arquivo para ArrayBuffer
 */
export function fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.onerror = () => {
            reject(new Error('Erro ao converter arquivo para ArrayBuffer'));
        };
        
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Detecta encoding de arquivo de texto
 */
export function detectTextEncoding(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            const bytes = new Uint8Array(reader.result);
            
            // Detecta UTF-8 BOM
            if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
                resolve('utf-8');
                return;
            }
            
            // Detecta UTF-16 BOM
            if (bytes.length >= 2) {
                if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
                    resolve('utf-16le');
                    return;
                }
                if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
                    resolve('utf-16be');
                    return;
                }
            }
            
            // Assume UTF-8 por padrão
            resolve('utf-8');
        };
        
        reader.onerror = () => {
            reject(new Error('Erro ao detectar encoding'));
        };
        
        reader.readAsArrayBuffer(file.slice(0, 1024)); // Lê apenas os primeiros 1024 bytes
    });
}

/**
 * Gera hash simples de arquivo
 */
export async function generateFileHash(file) {
    try {
        const buffer = await fileToArrayBuffer(file);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    } catch (error) {
        // Fallback para hash simples baseado no conteúdo
        const content = file.name + file.size + file.lastModified;
        return btoa(content).replace(/[+/=]/g, '').substring(0, 32);
    }
}

/**
 * Compara dois arquivos
 */
export function compareFiles(file1, file2) {
    return (
        file1.name === file2.name &&
        file1.size === file2.size &&
        file1.lastModified === file2.lastModified &&
        file1.type === file2.type
    );
}

/**
 * Valida arquivo antes do upload
 */
export function validateFile(file, options = {}) {
    const errors = [];
    
    // Validações básicas
    if (!file) {
        errors.push('Nenhum arquivo fornecido');
        return { valid: false, errors };
    }
    
    // Validação de tamanho
    if (options.maxSize && file.size > options.maxSize) {
        errors.push(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(options.maxSize)}`);
    }
    
    if (options.minSize && file.size < options.minSize) {
        errors.push(`Arquivo muito pequeno. Tamanho mínimo: ${formatFileSize(options.minSize)}`);
    }
    
    // Validação de tipo
    if (options.allowedTypes && !validateFileType(file, options.allowedTypes)) {
        errors.push(`Tipo de arquivo não suportado: ${file.type || 'desconhecido'}`);
    }
    
    // Validação de extensão
    if (options.allowedExtensions) {
        const extension = getFileExtension(file.name);
        if (!options.allowedExtensions.includes(extension)) {
            errors.push(`Extensão não suportada: .${extension}`);
        }
    }
    
    // Validação de nome
    if (options.maxNameLength && file.name.length > options.maxNameLength) {
        errors.push(`Nome do arquivo muito longo. Máximo: ${options.maxNameLength} caracteres`);
    }
    
    // Validação de caracteres no nome
    if (options.forbiddenChars) {
        const forbiddenFound = options.forbiddenChars.filter(char => file.name.includes(char));
        if (forbiddenFound.length > 0) {
            errors.push(`Nome contém caracteres proibidos: ${forbiddenFound.join(', ')}`);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Sanitiza nome de arquivo
 */
export function sanitizeFileName(filename) {
    return filename
        .replace(/[<>:"/\\|?*]/g, '_') // Substitui caracteres proibidos
        .replace(/\s+/g, '_') // Substitui espaços
        .replace(/_{2,}/g, '_') // Remove underscores duplos
        .replace(/^_|_$/g, '') // Remove underscores do início e fim
        .toLowerCase();
}

/**
 * Cria um objeto File a partir de dados
 */
export function createFileFromData(data, filename, type = 'text/plain') {
    const blob = new Blob([data], { type });
    return new File([blob], filename, { type });
}

/**
 * Download de arquivo
 */
export function downloadFile(data, filename, type = 'application/octet-stream') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}

/**
 * Lê arquivo como JSON
 */
export async function readFileAsJSON(file) {
    try {
        const text = await fileToText(file);
        return JSON.parse(text);
    } catch (error) {
        throw new Error(`Erro ao ler arquivo como JSON: ${error.message}`);
    }
}

/**
 * Verifica se arquivo é imagem
 */
export function isImageFile(file) {
    return file.type.startsWith('image/');
}

/**
 * Verifica se arquivo é texto
 */
export function isTextFile(file) {
    const textTypes = [
        'text/',
        'application/json',
        'application/xml',
        'application/javascript',
        'application/x-javascript'
    ];
    
    return textTypes.some(type => file.type.startsWith(type));
}

/**
 * Obtém ícone para tipo de arquivo
 */
export function getFileIcon(file) {
    const extension = getFileExtension(file.name);
    const type = file.type;
    
    // Ícones específicos por extensão
    const iconMap = {
        'pdf': 'bi-file-earmark-pdf',
        'doc': 'bi-file-earmark-word',
        'docx': 'bi-file-earmark-word',
        'xls': 'bi-file-earmark-excel',
        'xlsx': 'bi-file-earmark-excel',
        'ppt': 'bi-file-earmark-ppt',
        'pptx': 'bi-file-earmark-ppt',
        'txt': 'bi-file-earmark-text',
        'md': 'bi-file-earmark-text',
        'html': 'bi-file-earmark-code',
        'htm': 'bi-file-earmark-code',
        'css': 'bi-file-earmark-code',
        'js': 'bi-file-earmark-code',
        'json': 'bi-file-earmark-code',
        'xml': 'bi-file-earmark-code',
        'zip': 'bi-file-earmark-zip',
        'rar': 'bi-file-earmark-zip',
        '7z': 'bi-file-earmark-zip'
    };
    
    if (iconMap[extension]) {
        return iconMap[extension];
    }
    
    // Ícones por tipo MIME
    if (type.startsWith('image/')) return 'bi-file-earmark-image';
    if (type.startsWith('audio/')) return 'bi-file-earmark-music';
    if (type.startsWith('video/')) return 'bi-file-earmark-play';
    if (type.startsWith('text/')) return 'bi-file-earmark-text';
    
    return 'bi-file-earmark';
}

/**
 * Cria preview de arquivo
 */
export async function createFilePreview(file, maxSize = 100) {
    if (isImageFile(file)) {
        const base64 = await fileToBase64(file);
        return {
            type: 'image',
            data: base64,
            width: maxSize,
            height: maxSize
        };
    }
    
    // Tratamento especial para HTML
    if (isHTMLFile(file)) {
        const html = await fileToText(file);
        return {
            type: 'html',
            data: html,
            length: html.length,
            preview: extractHTMLPreview(html)
        };
    }
    
    if (isTextFile(file)) {
        const text = await fileToText(file);
        return {
            type: 'text',
            data: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
            length: text.length
        };
    }
    
    return {
        type: 'file',
        name: file.name,
        size: formatFileSize(file.size),
        icon: getFileIcon(file)
    };
}

/**
 * Verifica se é arquivo HTML
 */
export function isHTMLFile(file) {
    const extension = getFileExtension(file.name);
    return extension === 'html' || extension === 'htm' || file.type === 'text/html';
}

/**
 * Extrai preview renderizado do HTML
 */
export function extractHTMLPreview(html) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Remove elementos indesejados
        const unwantedTags = ['script', 'style', 'meta', 'link', 'title', 'head'];
        unwantedTags.forEach(tag => {
            const elements = doc.getElementsByTagName(tag);
            Array.from(elements).forEach(el => el.remove());
        });
        
        // Pega apenas o body ou o conteúdo principal
        const body = doc.body;
        if (body) {
            const bodyContent = body.innerHTML;
            return bodyContent.length > 500 ? bodyContent.substring(0, 500) + '...' : bodyContent;
        }
        
        // Se não há body, pega o conteúdo do documento
        const content = doc.documentElement.innerHTML;
        return content.length > 500 ? content.substring(0, 500) + '...' : content;
        
    } catch (error) {
        console.error('Erro ao extrair preview HTML:', error);
        // Fallback: remove tags e mostra texto
        const textContent = html.replace(/<[^>]*>/g, '');
        return textContent.length > 500 ? textContent.substring(0, 500) + '...' : textContent;
    }
}
