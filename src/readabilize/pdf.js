const { PdfReader } = require('pdfreader');

/**
 * Extraction de texte d'un fichier PDF
 * @param {Buffer|string} pdfInput - Le contenu du PDF sous forme de Buffer ou une chaîne
 * @returns {Promise<string>} - Le texte extrait
 */
async function readabilizePdf(pdfInput) {
    try {
        // Assurons-nous que l'entrée est un Buffer
        let pdfBuffer;
        
        if (Buffer.isBuffer(pdfInput)) {
            // Si c'est déjà un Buffer, on l'utilise directement
            pdfBuffer = pdfInput;
        } else if (typeof pdfInput === 'string') {
            // Si c'est une chaîne, on essaie de la convertir en Buffer
            pdfBuffer = Buffer.from(pdfInput);
        } else if (pdfInput && typeof pdfInput === 'object' && pdfInput.body) {
            // Si c'est un objet avec une propriété 'body' (comme une réponse HTTP)
            const body = pdfInput.body;
            if (Buffer.isBuffer(body)) {
                pdfBuffer = body;
            } else if (typeof body === 'string') {
                pdfBuffer = Buffer.from(body);
            } else {
                throw new Error('Format de réponse non pris en charge');
            }
        } else {
            throw new Error('Format d\'entrée non pris en charge');
        }
        
        // Vérification rapide pour s'assurer que c'est bien un PDF
        if (pdfBuffer.length < 4 || pdfBuffer.toString('ascii', 0, 4) !== '%PDF') {
            throw new Error('Le contenu ne semble pas être un PDF valide');
        }
        
        // Utiliser pdfreader pour extraire le texte
        return await extractWithPdfReader(pdfBuffer);
    } catch (error) {
        throw new Error(`Erreur lors de l'extraction du texte du PDF: ${error.message}`);
    }
}

/**
 * Extraction de texte avec pdfreader
 * @param {Buffer} pdfBuffer - Le contenu du PDF sous forme de Buffer
 * @returns {Promise<string>} - Le texte extrait
 */
async function extractWithPdfReader(pdfBuffer) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new PdfReader();
            const textByPage = {};
            let lastItem = null;

            reader.parseBuffer(pdfBuffer, (err, item) => {
                if (err) {
                    console.warn(`Avertissement lors de l'analyse du PDF: ${err.message}`);
                    // Continuer malgré l'erreur
                }

                if (!item) {
                    // Fin du PDF, assemblage du texte
                    const pages = Object.keys(textByPage).sort((a, b) => parseInt(a) - parseInt(b));
                    const text = pages.map(page => textByPage[page].join(' ')).join('\n\n');
                    
                    if (!text || text.trim() === '') {
                        resolve("Aucun texte n'a été extrait du PDF");
                    } else {
                        resolve(text.trim());
                    }
                    return;
                }

                // Traitement d'un élément texte
                if (item.text) {
                    const pageNum = item.page || 0;
                    if (!textByPage[pageNum]) {
                        textByPage[pageNum] = [];
                    }
                    
                    // Si c'est une nouvelle ligne (y différent), on ajoute un espace
                    if (lastItem && lastItem.page === item.page && Math.abs(lastItem.y - item.y) > 0.1) {
                        textByPage[pageNum].push('\n');
                    }
                    
                    textByPage[pageNum].push(item.text);
                    lastItem = item;
                }
            });
        } catch (error) {
            reject(new Error(`Erreur lors de l'analyse du PDF: ${error.message}`));
        }
    });
}

// Exporter la fonction d'extraction de PDF
module.exports = readabilizePdf;
