import React, { PropTypes } from 'react';

export default class ChildrenProxyComponent extends React.Component {
    static propTypes = {
        refCallback: PropTypes.func.isRequired
    };

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <regap-children ref={this.props.refCallback} />;
    }
}
