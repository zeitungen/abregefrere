const pdfParse = require('pdf-parse');

module.exports = async function readabilizePdf(pdfBuffer) {
    try {
        const data = await pdfParse(pdfBuffer);
        // data.text contient tout le texte extrait du PDF
        return data.text.trim();
    } catch (error) {
        throw new Error(`Erreur lors de l'extraction du texte du PDF: ${error.message}`);
    }
}
