import React from 'react';
import ReactDOM from 'react-dom';

import AttrsMixin from './attrs-mixin';
import SlotsMixin from './slots-mixin';
import CallbacksMixin from './callbacks-mixin';
import PublicMethodsMixin from './public-methods-mixin';

const Base = {
    _options: {},
    _reactComponentCtor: null,
    _reactComponent: null,
    _reactComponentRootElement: null,
    _refProp: function assignReactComponent(reactComponent) {
        this._reactComponent = reactComponent;
    },

    createdCallback() {
        this.regap = true;
        this._refProp = this._refProp.bind(this);
        this._initializeAttrs(this._options.attrs || {});
        this._initializeCallbacks(this._options.callbacks || {});
        this._initializePublicMethods(null, this._options.methods || {});
        this._initializeSlots(this._options.slots || {});
    },

    attachedCallback() {
        this._render();
    },

    attributeChangedCallback() {
        this._render();
    },

    /**
     * @returns {Object}
     */
    _getRenderProps() {
        return {
            ...this._getAttrsProps(),
            ...this._getCallbacksProps(),
            ...this._getSlotsProps(),
            ref: this._refProp
        };
    },

    _renderReactComponent() {
        ReactDOM.render(
            React.createElement(this._reactComponentCtor, this._getRenderProps()),
            this
        );

        this._reactComponentRootElement = this.querySelector('[data-reactroot]');
    },

    _render() {
        let oldReactComponent = this._reactComponent;

        this._renderReactComponent();

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
