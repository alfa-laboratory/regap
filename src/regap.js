import RegapHTMLELement from './html-element';

import AttrsMixin from './attrs-mixin';
import CallbacksMixin from './callbacks-mixin';
import PublicMethodsMixin from './public-methods-mixin';
import SlotsMixin from './slots-mixin';

/**
 * @typedef {Object} RegapComponentOptions
 * @property {Object.<AttrOption>} attrs
 * @property {Object.<CallbackOption>} callbacks
 * @property {Object.<SlotOption>} slots
 * @property {Object.<PublicMethodOption>} methods
 * @property {Function} onBeforeCreated
 * @property {Function} onAfterCreated
 * @property {Function} onBeforeAttached
 * @property {Function} onAfterAttached
 * @property {Function} onBeforeAttributeChanged
 * @property {Function} onAfterAttributeChanged
 * @property {Function} onBeforeDetached
 * @property {Function} onAfterDetached
 * @property {Function} ctor
 */

/**
 * @param {String} tagName
 * @param {Function} reactComponentCtor
 * @param {RegapComponentOptions} [options]
 * @returns {Function}
 */
function regap(tagName, reactComponentCtor, options = {}) {
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

regap.HTMLElement = RegapHTMLELement;

regap.mixins = {
    AttrsMixin,
    CallbacksMixin,
    PublicMethodsMixin,
    SlotsMixin
};

export default regap;
