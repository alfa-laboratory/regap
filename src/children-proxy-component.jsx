import React from 'react';

export default class ChildrenProxyComponent extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    /**
     * @type {HTMLElement}
     */
    element;

    render() {
        return <regap-children ref={(element) => { this.element = element; }} />;
    }
}
