/* eslint no-console: 0 */
import PublicMethodsMixin from './public-methods-mixin';
import { createTestComponent } from './test-utils';

describe('PublicMethodsMixin', () => {
    it('should expand public methods to component', () => {
        const PUBLIC_METHODS = { public1: { name: '' }, public2: { name: '' } };
        let component = createTestComponent('x-public-methods-expand', {
            createdCallback() {
                this._initializePublicMethods(null, PUBLIC_METHODS);
            }
        }, [PublicMethodsMixin]);

        expect(component).to.respondTo('public1');
        expect(component).to.respondTo('public2');
    });

    describe('warning', () => {
        beforeEach(() => {
            sinon.spy(console, 'warn');
        });

        afterEach(() => {
            console.warn.restore();
        });

        it('should generate console warning without React Component', () => {
            const PUBLIC_METHODS = { public1: { name: '' } };
            let component = createTestComponent('x-public-methods-console', {
                createdCallback() {
                    this._initializePublicMethods(null, PUBLIC_METHODS);
                }
            }, [PublicMethodsMixin]);

            component.public1();

            expect(console.warn).to.have.been.calledWith(
                'You can\'t call method \'public1\' if component not in DOM.'
            );
        });
    });

    it('should call public method on React Component', () => {
        const PUBLIC_METHODS = { public1: { name: 'componentPublic1' } };
        let reactComponent = { componentPublic1: sinon.spy() };
        let component = createTestComponent('x-public-methods-call', {
            createdCallback() {
                this._initializePublicMethods(reactComponent, PUBLIC_METHODS);
            }
        }, [PublicMethodsMixin]);

        component.public1();

        expect(reactComponent.componentPublic1).to.have.been.calledOnce;
    });

    it('should return public method call result', () => {
        const PUBLIC_METHODS = { public1: { name: 'componentPublic1' } };
        let reactComponent = { componentPublic1: sinon.stub().returns('result') };
        let component = createTestComponent('x-public-methods-result', {
            createdCallback() {
                this._initializePublicMethods(reactComponent, PUBLIC_METHODS);
            }
        }, [PublicMethodsMixin]);

        let result = component.public1();

        expect(result).to.be.equal('result');
    });

    it('should reinitialize methods', () => {
        const PUBLIC_METHODS = { public1: { name: 'componentPublic1' } };
        let reactComponent = { componentPublic1: sinon.spy() };
        let component = createTestComponent('x-public-methods-re', {
            createdCallback() {
                this._initializePublicMethods(null, PUBLIC_METHODS);
                this._initializePublicMethods(reactComponent, PUBLIC_METHODS);
            }
        }, [PublicMethodsMixin]);

        component.public1();

        expect(reactComponent.componentPublic1).to.have.been.calledOnce;
    });
});
