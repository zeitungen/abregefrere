const html = require('./html');

const Readabilizer = {
    html: 'html',
}

const readabilize = (type, input) => {
    switch (type) {
        case Readabilizer.html:
            return html(input);
        default:
            throw new Error('Unknown readabilizer type');
    }
}

module.exports = {
    Readabilizer, readabilize
}