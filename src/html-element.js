import React from 'react';
import ReactDOM from 'react-dom';

import AttrsMixin from './attrs-mixin';
import SlotsMixin from './slots-mixin';
import CallbacksMixin from './callbacks-mixin';
import PublicMethodsMixin from './public-methods-mixin';

const CALLBACKS = [
    'onBeforeCreated',
    'onAfterCreated',
    'onBeforeAttached',
    'onAfterAttached',
    'onBeforeAttributeChanged',
    'onAfterAttributeChanged',
    'onBeforeDetached',
    'onAfterDetached'
];

/**
 * Base Regap component composition.
 */
const Base = {
    _options: {},
    _reactComponentCtor: null,
    _reactComponent: null,
    _reactComponentRootElement: null,
    _refProp: function assignReactComponent(reactComponent) {
        this._reactComponent = reactComponent;
    },

    createdCallback() {
        this._applyCallbacks();

        if (this._onBeforeCreated) {
            this._onBeforeCreated();
        }

        this.regap = true;
        this._refProp = this._refProp.bind(this);
        this._initializeAttrs(this._options.attrs || {});
        this._initializeCallbacks(this._options.callbacks || {});
        this._initializePublicMethods(null, this._options.methods || {});
        this._initializeSlots(this._options.slots || {});

        if (this._onAfterCreated) {
            this._onAfterCreated();
        }
    },

    attachedCallback() {
        if (this._onBeforeAttached) {
            this._onBeforeAttached();
        }

        this._render();

        if (this._onAfterAttached) {
            this._onAfterAttached();
        }
    },

    attributeChangedCallback(attr, oldVal, newVal) {
        if (this._onBeforeAttributeChanged) {
            this._onBeforeAttributeChanged(attr, oldVal, newVal);
        }

        this._render();

        if (this._onAfterAttributeChanged) {
            this._onAfterAttributeChanged(attr, oldVal, newVal);
        }
    },

    detachedCallback() {
        if (this._onBeforeDetached) {
            this._onBeforeDetached();
        }

        if (this._onAfterDetached) {
            this._onAfterDetached();
        }
    },

    _applyCallbacks() {
        CALLBACKS.forEach((callbackName) => {
            if (this._options[callbackName]) {
                this[`_${callbackName}`] = this._options[callbackName].bind(this);
            }
        });
    },

    /**
     * @returns {Object}
     */
    _getRenderProps() {
        return {
            ...this._getAttrsProps(),
            ...this._getCallbacksProps(),
            ...this._getSlotsProps(this._reactComponentRootElement),
            ref: this._refProp
        };
    },

    /**
     * @protected
     * @param {Function} reactCtor
     * @param {Object} props
     */
    _renderReactComponent(reactCtor, props) {
        ReactDOM.render(
            React.createElement(reactCtor, props),
            this
        );
    },

    _render() {
        let oldReactComponent = this._reactComponent;

        this._renderReactComponent(this._reactComponentCtor, this._getRenderProps());
        this._reactComponentRootElement = this.querySelector('[data-reactroot]');

        if (this._reactComponent !== oldReactComponent) {
            this._initializePublicMethods(this._reactComponent, this._options.methods || {});
        }

        this._renderSlots(this._reactComponentRootElement);
    }
};

const RegapHTMLElement = Object.assign(
    {},
    PublicMethodsMixin,
    SlotsMixin,
    CallbacksMixin,
    AttrsMixin,
    Base
);

export default RegapHTMLElement;
