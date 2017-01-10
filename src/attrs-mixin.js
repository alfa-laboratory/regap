import clone from 'clone';

/**
 * @typedef {Function} AttrParseFunction
 * @param {*} value
 * @param {String} name
 * @returns {*}
 */

 /**
  * @typedef {Function} AttrStringifyFunction
  * @param {*} value
  * @param {String} name
  * @returns {String}
  */

/**
 * @typedef {Object} AttrType
 * @property {AttrParseFunction} parse
 * @property {AttrStringifyFunction} stringify
 */

/**
 * @typedef {Object} AttrOption
 * @property {String} name
 * @property {AttrType} type
 */

const AttrsMixin = {
    _attrs: null,

    /**
     * @param {Object.<AttrOption>} attrs
     */
    _initializeAttrs(attrs) {
        this._attrs = clone(attrs);

        this._originalSetAttribute = this.setAttribute.bind(this);
        this.setAttribute = this._getSetAttributeMethod();

        this._originalGetAttribute = this.getAttribute.bind(this);
        this.getAttribute = this._getGetAttributeMethod();

        this._originalHasAttribute = this.hasAttribute.bind(this);
        this.hasAttribute = this._getHasAttributeMethod();

        this._originalRemoveAttribute = this.removeAttribute.bind(this);
        this.removeAttribute = this._getRemoveAttributeMethod();

        this._defineAttrsGettersSetters(this._attrs);
        this._processInlineAttributes();
    },

    /**
     * @returns {Function}
     */
    _getSetAttributeMethod() {
        return (name, value) => {
            let normalizedName = name.toLowerCase();

            if (this._attrs[normalizedName]) {
                this._attrs[normalizedName].value = value;
                return;
            }

            this._originalSetAttribute(normalizedName, value);
        };
    },

    /**
     * @returns {Function}
     */
    _getGetAttributeMethod() {
        return (name) => {
            let normalizedName = name.toLowerCase();

            if (this._attrs[normalizedName]) {
                return this._attrs[normalizedName].value !== undefined
                    ? this._attrs[normalizedName].value
                    : null;
            }

            return this._originalGetAttribute(normalizedName);
        };
    },

    /**
     * @returns {Function}
     */
    _getHasAttributeMethod() {
        return (name) => {
            let normalizedName = name.toLowerCase();

            if (this._attrs[normalizedName]) {
                return this._attrs[normalizedName].value !== undefined;
            }

            return this._originalHasAttribute(normalizedName);
        };
    },

    /**
     * @returns {Function}
     */
    _getRemoveAttributeMethod() {
        return (name) => {
            let normalizedName = name.toLowerCase();

            if (this._attrs[normalizedName]) {
                delete this._attrs[normalizedName].value;
            }

            return this._originalRemoveAttribute(normalizedName);
        };
    },

    _defineAttrsGettersSetters(attrs) {
        Object.defineProperties(this, Object.keys(attrs).reduce((result, attrName) => {
            let attr = attrs[attrName];

            result[attrName] = {
                get: () => attr.value,
                set: (value) => {
                    attr.value = attr.type.parse(value, attrName);
                    this._originalSetAttribute(attrName, attr.type.stringify(attr.value, attrName));
                },
                enumerable: true,
                configurable: true
            };

            return result;
        }, {}));
    },

    _processInlineAttributes() {
        let attributes = this.attributes;
        let attributesLength = attributes.length;

        for (let i = 0; i < attributesLength; i += 1) {
            let item = attributes.item(i);

            if (this._attrs[item.name]) {
                this[item.name] = item.value;
            }
        }
    },

    /**
     * @returns {Object}
     */
    _getAttrsProps() {
        return Object.keys(this._attrs).reduce((result, attrName) => {
            let attr = this._attrs[attrName];

            if (attr.value !== undefined) {
                result[attr.name] = attr.value;
            }

            return result;
        }, {});
    }
};

export default AttrsMixin;
