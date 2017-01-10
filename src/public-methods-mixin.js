/* eslint no-console: 0 */
import clone from 'clone';

/**
 * @typedef {Object} MethodOption
 * @property {String} name
 */

const PublicMethodsMixin = {
    _methods: null,

    /**
     * @param {React.Component} reactComponent
     * @param {Object.<MethodOption>} methods
     */
    _initializePublicMethods(reactComponent, methods) {
        this._methods = clone(methods);

        Object.keys(this._methods).forEach((methodName) => {
            this[methodName] = reactComponent
                ? function regapPublicCall(...args) {
                    return reactComponent[this._methods[methodName].name]
                        .apply(reactComponent, ...args);
                }.bind(this)
                : function regapPublicCall() {
                    if (process.env.NODE_ENV !== 'production') {
                        console.warn(`You can't call method '${methodName}' if component not in DOM.`);
                    }
                };
        });
    }
};

export default PublicMethodsMixin;
