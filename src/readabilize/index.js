const html = require('./html');
const pdf = require('./pdf');

const Readabilizer = {
    html: 'html',
    pdf: 'pdf'
}

const readabilize = (type, input) => {
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