import React from 'react';
import ReactDOM from 'react-dom';
import CallbacksMixin from './callbacks-mixin';
import { createTestComponentCtor, renderInBody, cleanBody } from './test-utils';

class ReactCallbacksComponent extends React.Component {
    static propTypes = {
        onClick: React.PropTypes.func
    };

    static defaultProps = {
        onClick: null
    };

    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        if (this.props.onClick) {
            this.props.onClick('test-event-arg');
        }
    }

    render() {
        return <button onClick={this.handleOnClick} />;
    }
}

const CALLBACKS = {
    click: {
        onFunctionName: 'onClick'
    }
};

function createCallbacksMixinComponentCtor(tagName, callbacks) {
    return createTestComponentCtor(tagName, {
        createdCallback() {
            this._initializeCallbacks(callbacks);
        },

        attachedCallback() {
            ReactDOM.render(React.createElement(ReactCallbacksComponent, {
                ...this._getCallbacksProps(),
                ref: (reactComponent) => { this._reactComponent = reactComponent; }
            }), this);

            this._reactComponentRootElement = this.querySelector('[data-reactroot]');
        },

        getCallbacksProps() {
            return this._getCallbacksProps();
        },

        getReactComponentRootElement() {
            return this._reactComponentRootElement;
        }
    }, [CallbacksMixin]);
}

describe('CallbacksMixin', () => {
    afterEach(cleanBody);

    it('should subscribe to React Component after `addEventListener` call', () => {
        createCallbacksMixinComponentCtor('x-callbacks-add', CALLBACKS);
        let component = renderInBody('<x-callbacks-add></x-callbacks-add>');
        let onClick = sinon.spy();

        component.addEventListener('click', onClick);
        component.getReactComponentRootElement().click();

        expect(onClick).to.have.been.calledOnce;
    });

    it('should pass `CustomEvent` to callback', () => {
        createCallbacksMixinComponentCtor('x-callbacks-event', CALLBACKS);
        let component = renderInBody('<x-callbacks-event></x-callbacks-event>');
        let onClick = sinon.spy();

        component.addEventListener('click', onClick);
        component.getReactComponentRootElement().click();

        expect(onClick).to.have.been.calledWith(sinon.match.instanceOf(CustomEvent));
    });

    it('should pass React Component arguments as `detail` of `CustomEvent`', () => {
        createCallbacksMixinComponentCtor('x-callbacks-detail', CALLBACKS);
        let component = renderInBody('<x-callbacks-detail></x-callbacks-detail>');
        let onClick = sinon.spy();

        component.addEventListener('click', onClick);
        component.getReactComponentRootElement().click();

        expect(onClick).to.have.been.calledWith(sinon.match({ detail: ['test-event-arg'] }));
    });

    it('should unsubscribe from React Component after `removeEventListener` call', () => {
        createCallbacksMixinComponentCtor('x-callbacks-remove', CALLBACKS);
        let component = renderInBody('<x-callbacks-remove></x-callbacks-remove>');
        let onClick = sinon.spy();

        component.addEventListener('click', onClick);
        component.removeEventListener('click', onClick);
        component.getReactComponentRootElement().click();

        expect(onClick).to.have.been.notCalled;
    });

    it('should subscribe to unspecified event after `addEventListener` call', () => {
        createCallbacksMixinComponentCtor('x-callbacks-add-unspec', {});
        let component = renderInBody('<x-callbacks-add-unspec></x-callbacks-add-unspec>');
        let onClick = sinon.spy();

        component.addEventListener('click', onClick);
        component.click();

        expect(onClick).to.have.been.calledOnce;
    });

    it('should unsubscribe from unspecified event after `removeEventListener` call', () => {
        createCallbacksMixinComponentCtor('x-callbacks-remove-unspec', {});
        let component = renderInBody('<x-callbacks-remove-unspec></x-callbacks-remove-unspec>');
        let onClick = sinon.spy();

        component.addEventListener('click', onClick);
        component.removeEventListener('click', onClick);
        component.click();

        expect(onClick).to.have.been.notCalled;
    });

    it('should return React props for specified callbacks', () => {
        createCallbacksMixinComponentCtor('x-callbacks-props', CALLBACKS);
        let component = renderInBody('<x-callbacks-props></x-callbacks-props>');

        let result = component.getCallbacksProps();

        expect(result).to.have.property('onClick');
        expect(result.onClick).to.be.function;
    });
});
