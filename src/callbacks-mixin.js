import clone from 'clone';

/**
 * @typedef {Object} CallbackOption
 * @property {String} onFunctionName
 */

const CallbacksMixin = {
    _callbacks: null,
    _callbacksProps: null,

    /**
     * @param {Object.<CallbackOption>} callbacks
     */
    _initializeCallbacks(callbacks) {
        this._callbacks = clone(callbacks);

        this._originalAddEventListener = this.addEventListener.bind(this);
        this.addEventListener = this._getAddEventListenerMethod();

        this._originalRemoveEventListener = this.removeEventListener.bind(this);
        this.removeEventListener = this._getRemoveEventListenerMethod();

        this._subscribeToReactComponent();
    },

    _getAddEventListenerMethod() {
        let callbacks = this._callbacks;

        return (eventName, callback, capture) => {
            if (!callbacks[eventName]) {
                this._originalAddEventListener(eventName, callback, capture);
                return;
            }

            if (!callbacks[eventName].listeners) {
                callbacks[eventName].listeners = [];
            }

            let callbackIndex = callbacks[eventName].listeners.indexOf(callback);
            if (callbackIndex === -1) {
                callbacks[eventName].listeners.push(callback);
            }
        };
    },

    _getRemoveEventListenerMethod() {
        let callbacks = this._callbacks;

        return (eventName, callback, capture) => {
            if (!callbacks[eventName]) {
                this._originalRemoveEventListener(eventName, callback, capture);
                return;
            }

            if (callbacks[eventName].listeners) {
                let callbackIndex = callbacks[eventName].listeners.indexOf(callback);
                if (callbackIndex !== -1) {
                    callbacks[eventName].listeners.splice(callbackIndex, 1);
                }
            }
        };
    },

    _subscribeToReactComponent() {
        let me = this;

        this._callbacksProps = Object.keys(this._callbacks)
            .reduce((result, eventName) => {
                result[this._callbacks[eventName].onFunctionName] =
                    function regapCallback(...args) {
                        let event = new CustomEvent(eventName, {
                            detail: args,
                            bubbles: true,
                            cancelable: true
                        });
                        me.dispatchEvent(event);
                        // eslint-disable-next-line
                        me._callbacks[eventName].listeners.forEach(callback => callback(event));
                    };

                return result;
            }, {});
    },

    /**
     * @returns {Object}
     */
    _getCallbacksProps() {
        return this._callbacksProps;
    }
};

export default CallbacksMixin;
