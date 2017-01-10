import React from 'react';
import regap from './regap';

class ReactComponent extends React.Component {
    render() {
        return <div />;
    }
}

describe('regap', () => {
    it('should create Regap Component constructor which create HTMLElement instance', () => {
        let Component = regap('x-regap', ReactComponent);
        let component = new Component();

        expect(component).to.be.instanceof(HTMLElement);
        expect(component).to.have.property('regap');
    });

    it('should throw `Please provide tag name` error with missed `tagName` argument', () => {
        expect(() => regap()).to.throw('Please provide tag name');
    });

    it('should throw `Please provide React Component constructor` error with missed `reactComponentConstructor` argument', () => {
        expect(() => regap('x-regap')).to.throw('Please provide React Component constructor');
    });
});
