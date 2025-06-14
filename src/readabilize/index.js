const html = require('./html');
const pdf = require('./pdf');
const { detectContentType } = require('./content-detector');

const Readabilizer = {
    html: 'html',
    pdf: 'pdf',
    auto: 'auto'
}

const readabilize = (type, input) => {
    // Si le type est 'auto', on détecte automatiquement le type de contenu
    if (type === Readabilizer.auto) {
        try {
            const detectedType = detectContentType(input);
            return readabilize(detectedType, input);
        } catch (error) {
            throw new Error(`Impossible de déterminer automatiquement le type de contenu: ${error.message}`);
        }
    }

    // Sinon, on utilise le type spécifié
    switch (type) {
        case Readabilizer.html:
            return html(input);
        case Readabilizer.pdf:
            return pdf(input);
        default:
            throw new Error('Unknown readabilizer type');
    }
}

module.exports = {
    Readabilizer, readabilize
}