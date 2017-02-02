import React from 'react';
import ReactDOM from 'react-dom';
import SlotsMixin from './slots-mixin';
import { createTestComponentCtor, renderInBody, cleanBody } from './test-utils';

function createSlotsMixinComponentCtor(tagName, reactSlotsComponent, slots) {
    return createTestComponentCtor(tagName, {
        createdCallback() {
            this._initializeSlots(slots);
        },

        attachedCallback() {
            ReactDOM.render(React.createElement(reactSlotsComponent, {
                ...this._getSlotsProps(),
                ref: (reactComponent) => { this._reactComponent = reactComponent; }
            }), this);

            this._reactComponentRootElement = this.querySelector('[data-reactroot]');

            this._renderSlots(this._reactComponentRootElement);
        },

        getSlotsProps() {
            return this._getSlotsProps();
        },

        getReactComponentRootElement() {
            return this._reactComponentRootElement;
        }
    }, [SlotsMixin]);
}

class ReactSimpleSlotsComponent extends React.Component {
    static propTypes = {
        children: React.PropTypes.node
    };

    static defaultProps = {
        children: null
    };

    render() {
        return <div className="children-slot">{this.props.children}</div>;
    }
}

class ReactNamedSlotsComponent extends React.Component {
    static propTypes = {
        children: React.PropTypes.node,
        namedSlotChildren: React.PropTypes.node
    };

    static defaultProps = {
        children: null,
        namedSlotChildren: null
    };

    render() {
        return (
            <div className="children-slot">
                {this.props.children}
                <span className="named-slot">{this.props.namedSlotChildren}</span>
            </div>
        );
    }
}

const NAMED_SLOTS = {
    'named-slot': {
        name: 'namedSlotChildren'
    }
};

class ReactComplexNamedSlotsComponent extends React.Component {
    static propTypes = {
        children: React.PropTypes.node,
        namedSlotChildren: React.PropTypes.node,
        namedSlot2Children: React.PropTypes.node
    };

    static defaultProps = {
        children: null,
        namedSlotChildren: null,
        namedSlot2Children: null
    };

    render() {
        return (
            <div className="children-slot">
                {this.props.children}
                <span className="named-slot">{this.props.namedSlotChildren}</span>
                <span className="named-slot-2">{this.props.namedSlot2Children}</span>
            </div>
        );
    }
}

const COMPLEX_NAMED_SLOTS = {
    'named-slot': {
        name: 'namedSlotChildren'
    },
    'named-slot-2': {
        name: 'namedSlot2Children'
    }
};

describe('SlotsMixin', () => {
    afterEach(cleanBody);

    it('should render component childs nodes as React component children', () => {
        createSlotsMixinComponentCtor('x-slots-childs', ReactSimpleSlotsComponent, null);

        let component = renderInBody('<x-slots-childs>Some <u>children</u> content</x-slots-childs>');

        expect(component).to.have.html(
            '<div data-reactroot="" class="children-slot">' +
                '<regap-children>Some <u>children</u> content</regap-children>' +
            '</div>'
        );
    });

    it('should not render <regap-children> without children passed', () => {
        createSlotsMixinComponentCtor('x-slots-empty', ReactSimpleSlotsComponent, null);

        let component = renderInBody('<x-slots-empty></x-slots-empty>');

        expect(component).to.have.html('<div data-reactroot="" class="children-slot"></div>');
    });

    it('should render component\'s named slot children as React component children (legacy syntax)', () => {
        createSlotsMixinComponentCtor('x-slots-named', ReactNamedSlotsComponent, NAMED_SLOTS);

        let component = renderInBody(
            '<x-slots-named>' +
                '<slot name="named-slot">' +
                    'Some <i>named</i> slot children' +
                '</slot>' +
            '</x-slots-named>'
        );

        expect(component).to.have.html(
            '<div data-reactroot="" class="children-slot">' +
                '<span class="named-slot">' +
                    '<regap-children>Some <i>named</i> slot children</regap-children>' +
                '</span>' +
            '</div>'
        );
    });

    it('should not render <regap-children> without named slot children passed (legacy syntax)', () => {
        createSlotsMixinComponentCtor('x-slots-named-empty', ReactNamedSlotsComponent, NAMED_SLOTS);

        let component = renderInBody(
            '<x-slots-named-empty>' +
                '<slot name="named-slot"></slot>' +
            '</x-slots-named-empty>'
        );

        expect(component).to.have.html(
            '<div data-reactroot="" class="children-slot">' +
                '<span class="named-slot"></span>' +
            '</div>'
        );
    });

    it('should render component\'s named slot children as React component children', () => {
        createSlotsMixinComponentCtor('x-slots-named-2', ReactNamedSlotsComponent, NAMED_SLOTS);

        let component = renderInBody(
            '<x-slots-named-2>' +
                '<div slot="named-slot">' +
                    'Some <i>named</i> slot children' +
                '</div>' +
            '</x-slots-named-2>'
        );

        expect(component).to.have.html(
            '<div data-reactroot="" class="children-slot">' +
                '<span class="named-slot">' +
                    '<regap-children>' +
                        '<div slot="named-slot">Some <i>named</i> slot children</div>' +
                    '</regap-children>' +
                '</span>' +
            '</div>'
        );
    });

    it('should render component\'s named slots children as React component children', () => {
        createSlotsMixinComponentCtor(
            'x-slots-named-3',
            ReactComplexNamedSlotsComponent,
            COMPLEX_NAMED_SLOTS
        );

        let component = renderInBody(
            '<x-slots-named-3>' +
                '<div slot="named-slot">' +
                    'Some <i>named</i> slot children' +
                '</div>' +
                '<div slot="named-slot-2">' +
                    'Second named slot' +
                '</div>' +
            '</x-slots-named-3>'
        );

        expect(component).to.have.html(
            '<div data-reactroot="" class="children-slot">' +
                '<span class="named-slot">' +
                    '<regap-children>' +
                        '<div slot="named-slot">Some <i>named</i> slot children</div>' +
                    '</regap-children>' +
                '</span>' +
                '<span class="named-slot-2">' +
                    '<regap-children>' +
                        '<div slot="named-slot-2">Second named slot</div>' +
                    '</regap-children>' +
                '</span>' +
            '</div>'
        );
    });
});
