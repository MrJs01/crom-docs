// --- JSON Copy System ---
export class JSONCopySystem {
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Swal.fire({
                icon: 'success',
                title: 'Copiado!',
                text: 'JSON copiado para a área de transferência',
                timer: 2000,
                showConfirmButton: false,
                background: '#24282e',
                color: '#e0e6eb'
            });
        } catch (err) {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            Swal.fire({
                icon: 'success',
                title: 'Copiado!',
                text: 'JSON copiado para a área de transferência',
                timer: 2000,
                showConfirmButton: false,
                background: '#24282e',
                color: '#e0e6eb'
            });
        }
    }
}
