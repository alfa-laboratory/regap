import React from 'react';
import RegapHtmlElement from './html-element';
import { createTestComponentCtor, renderInBody, cleanBody } from './test-utils';

class HtmlElementComponent extends React.Component {
    render() {
        return <div className="html-element-component" />;
    }
}

describe('HtmlElement', () => {
    afterEach(cleanBody);

    it('should render React component', () => {
        createTestComponentCtor(
            'x-element',
            { _reactComponentCtor: HtmlElementComponent },
            [RegapHtmlElement]
        );

        let component = renderInBody('<x-element></x-element>');

        expect(component).to.have.html('<div data-reactroot="" class="html-element-component"></div>');
    });

    it('should call `onBeforeCreated` callback after create component', () => {
        let onBeforeCreated = sinon.spy();
        createTestComponentCtor(
            'x-before-create-call',
            {
                _reactComponentCtor: HtmlElementComponent,
                _options: {
                    onBeforeCreated
                }
            },
            [RegapHtmlElement]
        );

        renderInBody('<x-before-create-call></x-before-create-call>');

        expect(onBeforeCreated).to.have.been.calledOnce;
    });

    it('should call `onAfterCreated` callback after create component', () => {
        let onAfterCreated = sinon.spy();
        createTestComponentCtor(
            'x-after-create-call',
            {
                _reactComponentCtor: HtmlElementComponent,
                _options: {
                    onAfterCreated
                }
            },
            [RegapHtmlElement]
        );

        renderInBody('<x-after-create-call></x-after-create-call>');

        expect(onAfterCreated).to.have.been.calledOnce;
    });

    it('should call `onBeforeCreated` before `onAfterCreated` callback after create component',
    () => {
        let onBeforeCreated = sinon.spy();
        let onAfterCreated = sinon.spy();
        createTestComponentCtor(
            'x-create-call-seq',
            {
                _reactComponentCtor: HtmlElementComponent,
                _options: {
                    onBeforeCreated,
                    onAfterCreated
                }
            },
            [RegapHtmlElement]
        );

        renderInBody('<x-create-call-seq></x-create-call-seq>');

        expect(onBeforeCreated).to.have.been.calledBefore(onAfterCreated);
    });

    it('should call `onBeforeAttached` callback after attach component', () => {
        let onBeforeAttached = sinon.spy();
        createTestComponentCtor(
            'x-before-attach-call',
            {
                _reactComponentCtor: HtmlElementComponent,
                _options: {
                    onBeforeAttached
                }
            },
            [RegapHtmlElement]
        );

        renderInBody('<x-before-attach-call></x-before-attach-call>');

        expect(onBeforeAttached).to.have.been.calledOnce;
    });

    it('should call `onAfterAttached` callback after attach component', () => {
        let onAfterAttached = sinon.spy();
        createTestComponentCtor(
            'x-after-attach-call',
            {
                _reactComponentCtor: HtmlElementComponent,
                _options: {
                    onAfterAttached
                }
            },
            [RegapHtmlElement]
        );

        renderInBody('<x-after-attach-call></x-after-attach-call>');

        expect(onAfterAttached).to.have.been.calledOnce;
    });

    it('should call `onBeforeAttached` before `onAfterAttached` callback after attach component',
    () => {
        let onBeforeAttached = sinon.spy();
        let onAfterAttached = sinon.spy();
        createTestComponentCtor(
            'x-attach-call-seq',
            {
                _reactComponentCtor: HtmlElementComponent,
                _options: {
                    onBeforeAttached,
                    onAfterAttached
                }
            },
            [RegapHtmlElement]
        );

        renderInBody('<x-attach-call-seq></x-attach-call-seq>');

        expect(onBeforeAttached).to.have.been.calledBefore(onAfterAttached);
    });
});
