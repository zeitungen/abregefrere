const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

module.exports = function readibilizeHtml(html) {
    var doc = new JSDOM(html, {
        url: "https://www.thrownewexception.com/you-probably-dont-need-microservices/"
    });
    let reader = new Readability(doc.window.document);
    let article = reader.parse();

    const textContent = article.textContent.trim();
    return article.title + '\n' + textContent;
}