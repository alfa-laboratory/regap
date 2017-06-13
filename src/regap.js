import RegapHTMLELement from './html-element';

import AttrsMixin from './attrs-mixin';
import CallbacksMixin from './callbacks-mixin';
import PublicMethodsMixin from './public-methods-mixin';
import SlotsMixin from './slots-mixin';

import Types from './types';

/**
 * Regap component description.
 *
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
 * @property {Object} ctor
 */

/**
 * Register WebComponent based on React component.
 *
 * @param {String} tagName Tag name
 * @param {Function} reactComponentCtor React component constructor
 * @param {RegapComponentOptions} [options] Some options
 * @returns {Function} WebComponent constructor.
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
            {
                _reactComponentCtor: reactComponentCtor,
                _options: options
            }
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

regap.types = Types;

export default regap;

if (typeof window !== 'undefined') {
    window.regap = regap;
}
