import RegapHTMLELement from './html-element';

/**
 * @typedef {Object} RegapComponentOptions
 * @property {Object.<AttrOption>} attrs
 * @property {Object.<CallbackOption>} callbacks
 * @property {Object.<SlotOption>} slots
 * @property {Object.<PublicMethodOption>} methods
 * @property {Function} ctor
 */

/**
 * @param {String} tagName
 * @param {Function} reactComponentCtor
 * @param {RegapComponentOptions} [options]
 * @returns {Function}
 */
export default function regap(tagName, reactComponentCtor, options = {}) {
    if (process.env.NODE_ENV !== 'production') {
        if (typeof tagName !== 'string') {
            throw new Error('Please provide tag name');
        }

        if (typeof reactComponentCtor !== 'function') {
            throw new Error('Please provide React Component constructor');
        }
    }

    return document.registerElement(
        tagName,
        { prototype: Object.assign(
            Object.create(HTMLElement.prototype),
            options.ctor || RegapHTMLELement,
            { _options: options }
        ) }
    );
}
