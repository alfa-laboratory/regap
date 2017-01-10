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
});
