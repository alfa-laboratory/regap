import AttrsMixin from './attrs-mixin';
import { createTestComponent, createTestComponentCtor, renderInBody, cleanBody } from './test-utils';

const ATTRS = {
    'test-attr': {
        name: 'testAttr',
        type: {
            parse: String,
            stringify: String
        }
    },
    'test-attr-2': {
        name: 'testAttr2',
        type: {
            parse: String,
            stringify: String
        }
    }
};

function createAttrsMixinComponentCtor(tagName, attrs) {
    return createTestComponentCtor(tagName, {
        createdCallback() {
            this._initializeAttrs(attrs);
        },
        getAttrsProps() {
            return this._getAttrsProps();
        }
    }, [AttrsMixin]);
}

describe('AttrsMixin', () => {
    afterEach(cleanBody);

    it('should define setters/getters for attributes', () => {
        let component = createTestComponent('x-attrs-set-get', {
            createdCallback() {
                this._initializeAttrs(ATTRS);
            }
        }, [AttrsMixin]);

        expect(component).to.have.ownPropertyDescriptor('test-attr');
        expect(component).to.have.ownPropertyDescriptor('test-attr-2');
    });

    it('should reflect inline attributes to public properties', () => {
        createAttrsMixinComponentCtor('x-attrs-inline', ATTRS);

        let component = renderInBody(
            '<x-attrs-inline test-attr="test-value" test-attr-2="test-value-2"></x-attrs-inline>'
        );

        expect(component['test-attr']).to.be.equal('test-value');
        expect(component['test-attr-2']).to.be.equal('test-value-2');
    });

    it('should sync attribute with public property', () => {
        createAttrsMixinComponentCtor('x-attrs-sync', ATTRS);
        let component = renderInBody('<x-attrs-sync></x-attrs-sync>');

        component['test-attr'] = 'new-test-value';

        expect(component).to.match('[test-attr="new-test-value"]');
    });

    it('should sync public property with attribute', () => {
        createAttrsMixinComponentCtor('x-attrs-sync2', ATTRS);
        let component = renderInBody('<x-attrs-sync2></x-attrs-sync2>');

        component.setAttribute('test-attr', 'new-test-value');

        expect(component).to.have.property('test-attr', 'new-test-value');
    });

    it('should return attribute value after `getAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-get', ATTRS);
        let component = renderInBody('<x-attrs-get test-attr="test-value"></x-attrs-get>');

        let result = component.getAttribute('test-attr');

        expect(result).to.be.equal('test-value');
    });

    it('should return `null` for not existing attribute after `getAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-get2', ATTRS);
        let component = renderInBody('<x-attrs-get2 test-attr="test-value"></x-attrs-get2>');

        let result = component.getAttribute('not-exists-attr');

        expect(result).to.be.null;
    });

    it('should return `true` for existing attributes after `hasAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-has', ATTRS);
        let component = renderInBody('<x-attrs-has test-attr="test-value"></x-attrs-has>');

        let result = component.hasAttribute('test-attr');

        expect(result).to.be.true;
    });

    it('should return `false` for not existing attributes after `hasAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-has2', ATTRS);
        let component = renderInBody('<x-attrs-has2 test-attr="test-value"></x-attrs-has2>');

        let result = component.hasAttribute('no-exists-attr');

        expect(result).to.be.false;
    });

    it('should remove attribute after `removeAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-remove', ATTRS);
        let component = renderInBody('<x-attrs-remove test-attr="test-value"></x-attrs-remove>');

        component.removeAttribute('test-attr');

        expect(component).to.not.match('[test-attr]');
    });

    it('should remove public property after `removeAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-remove2', ATTRS);
        let component = renderInBody('<x-attrs-remove2 test-attr="test-value"></x-attrs-remove2>');

        component.removeAttribute('test-attr');

        expect(component['test-attr']).to.be.undefined;
    });

    it('should set unspecified attribute value after `setAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-unspec-set', ATTRS);
        let component = renderInBody('<x-attrs-unspec-set></x-attrs-unspec-set>');

        component.setAttribute('unspec-attr', 'test-value');
        let result = component.getAttribute('unspec-attr');

        expect(result).to.be.equal('test-value');
    });

    it('should return `true` for unspecified attribute after `hasAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-unspec-has', ATTRS);
        let component = renderInBody('<x-attrs-unspec-has unspec-attr="test-value"></x-attrs-unspec-has>');

        let result = component.hasAttribute('unspec-attr');

        expect(result).to.be.true;
    });

    it('should return `false` for not defined unspecified attribute after `hasAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-unspec-has2', ATTRS);
        let component = renderInBody('<x-attrs-unspec-has2></x-attrs-unspec-has2>');

        let result = component.hasAttribute('unspec-attr');

        expect(result).to.be.false;
    });

    it('should remove unspecified attribute after `removeAttribute` call', () => {
        createAttrsMixinComponentCtor('x-attrs-unspec-remove', ATTRS);
        let component = renderInBody('<x-attrs-unspec-remove unspec-attr="test-value"></x-attrs-unspec-remove>');

        component.removeAttribute('unspec-attr');
        let result = component.hasAttribute('unspec-attr');

        expect(result).to.be.false;
    });

    it('should use type.parse for set public property', () => {
        function parse(name) {
            return String(name);
        }
        const PARSE_ATTRS = {
            'test-attr': {
                name: 'testAttr',
                type: {
                    parse: sinon.spy(parse),
                    stringify: String
                }
            }
        };
        createAttrsMixinComponentCtor('x-attrs-parse', PARSE_ATTRS);
        let component = renderInBody('<x-attrs-parse></x-attrs-parse>');

        component['test-attr'] = 'test-value';

        expect(PARSE_ATTRS['test-attr'].type.parse).to.have.been.calledOnce;
        expect(PARSE_ATTRS['test-attr'].type.parse).to.have.been.calledWith('test-value', 'test-attr');
    });

    it('should use type.stringify for set attribute', () => {
        function stringify(name) {
            return String(name);
        }
        const PARSE_ATTRS = {
            'test-attr': {
                name: 'testAttr',
                type: {
                    parse: String,
                    stringify: sinon.spy(stringify)
                }
            }
        };
        createAttrsMixinComponentCtor('x-attrs-parse2', PARSE_ATTRS);
        let component = renderInBody('<x-attrs-parse2></x-attrs-parse2>');

        component['test-attr'] = 'test-value';

        expect(PARSE_ATTRS['test-attr'].type.stringify).to.have.been.calledOnce;
        expect(PARSE_ATTRS['test-attr'].type.stringify).to.have.been.calledWith('test-value', 'test-attr');
    });

    it('should return React props from attributes', () => {
        createAttrsMixinComponentCtor('x-attrs-props', ATTRS);
        let component = renderInBody(
            '<x-attrs-props test-attr="test-value" test-attr-2="test-value-2"></x-attrs-props>'
        );

        let result = component.getAttrsProps();

        expect(result).to.deep.equal({ testAttr: 'test-value', testAttr2: 'test-value-2' });
    });

    it('should not return React props for not existing attributes', () => {
        createAttrsMixinComponentCtor('x-attrs-props2', ATTRS);
        let component = renderInBody('<x-attrs-props2 test-attr="test-value"></x-attrs-props2>');

        let result = component.getAttrsProps();

        expect(result).to.deep.equal({ testAttr: 'test-value' });
    });
});
