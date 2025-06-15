/**
 * Détecte automatiquement le type de contenu et retourne le Readabilizer approprié
 * @param {Buffer|string} content - Le contenu à analyser
 * @returns {string} - Le type de Readabilizer à utiliser
 */
const Readabilizer = require('./readabilizer');

function detectContentType(content) {
    // Convertir en string si c'est un buffer
    const contentStr = Buffer.isBuffer(content) ? content.toString('utf8', 0, 1000) : content.substring(0, 1000);
    
    // Vérifier si c'est un PDF
    if (isPdf(content)) {
        return Readabilizer.pdf;
    }
    
    // Vérifier si c'est du HTML
    if (isHtml(contentStr)) {
        return Readabilizer.html;
    }
    
    // Par défaut, on considère que c'est du texte brut
    throw new Error('Type de contenu non pris en charge');
}

/**
 * Vérifie si le contenu est un fichier PDF
 * @param {Buffer|string} content - Le contenu à analyser
 * @returns {boolean} - true si c'est un PDF, false sinon
 */
function isPdf(content) {
    // Un fichier PDF commence par la signature %PDF
    if (Buffer.isBuffer(content)) {
        return content.length >= 4 && content.toString('ascii', 0, 4) === '%PDF';
    } else if (typeof content === 'string') {
        return content.substring(0, 4) === '%PDF';
    }
    return false;
}

/**
 * Vérifie si le contenu est du HTML
 * @param {string} content - Le contenu à analyser
 * @returns {boolean} - true si c'est du HTML, false sinon
 */
function isHtml(content) {
    // Recherche des balises HTML courantes
    const htmlPatterns = [
        /<html[^>]*>/i,
        /<body[^>]*>/i,
        /<head[^>]*>/i,
        /<div[^>]*>/i,
        /<p[^>]*>/i,
        /<script[^>]*>/i,
        /<a\s+href/i,
        /<!DOCTYPE\s+html/i
    ];
    
    return htmlPatterns.some(pattern => pattern.test(content));
}

module.exports = {
    detectContentType
};
