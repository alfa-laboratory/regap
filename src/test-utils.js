export function renderInBody(html) {
    document.body.innerHTML = html;
    return document.body.firstChild;
}

export function cleanBody() {
    while (document.body.childNodes.length > 0) {
        document.body.removeChild(document.body.firstChild);
    }
}

export function createTestComponentCtor(tagName, base, mixins) {
    return document.registerElement(
        tagName,
        {
            prototype: Object.assign(
                Object.create(HTMLElement.prototype),
                Object.assign({}, ...mixins, base)
            )
        }
    );
}

export function createTestComponent(tagName, base, mixins) {
    return new (createTestComponentCtor(tagName, base, mixins))();
}
