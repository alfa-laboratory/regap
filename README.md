# Regap

Use your React components as WebComponents.

## Motivation

## Base concepts

* [Attributes reflection](#attributes-reflection)
* [Callbacks binding](#callbacks-binding)
* [Public methods binding](#public-methods-binding)
* [Slots](#slots)

### Attributes reflection

Regap provides feature to reflect WebComponents attributes to React components props.

#### Usage example <a href="#attributes-reflection"></a>

```javascript
// react-component.js
import React from 'react';

export default class ReactComponent extends React.Component {
    static propTypes = {
        someCounter: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <div>Some counter: {this.props.someCounter}</div>
        );
    }
}

// regap-component.js
import regap from 'regap';
import ReactComponent from './react-component';

regap('x-example', ReactComponent, {
    // Place your attributes description to `attrs` object. Use property name as attribute name and provide
    // `name` key to describe React component's prop name. Than provide `type` key to describe `prop` type.
    attrs: {
        'some-counter': {
            name: 'someComponent',
            type: regap.types.NumberType
        }
    }
});

// Render WebComponent to body
document.body.innerHTML = '<x-example some-counter="5"></x-example>';

// Get WecComponent's instance
let xExample = document.body.querySelector('x-example');

xExample.setAttribute('some-counter', 10); // Rerender component throw `setAttribute` call.
xExample['some-counter'] = 20; // Rerender component throw property assign.
```

#### Predefined types

* `regap.types.ArrayType`
* `regap.types.BooleanType`
* `regap.types.FunctionType`
* `regap.types.NumberType`
* `regap.types.ObjectType`
* `regap.types.StringType`

### Callbacks bindings <a href="#callbacks-bindings"></a>

Regap provides feature to bind WebComponents callbacks to React components callbacks props.

#### Usage example

```javascript
// react-component.js
import React from 'react';

export default class ReactComponent extends React.Component {
    static propTypes = {
        onClick: React.PropType.func.isRequired
    };

    handleClick() {
        this.props.onClick('first value', 'second value');
    }

    render() {
        return (
            <div onClick={ this.handleClick } />
        );
    }
}

// regap-component.js
import regap from 'regap';
import ReactComponent from './react-component';

regap('x-example', ReactComponent, {
    // Place your callbacks description to `callbacks` object. Use property name as callback name and provide
    // `name` key to describe React component's prop name.
    callbacks: {
        click: {
            onFunctionName: 'onClick'
        }
    }
});

// Render WebComponent to body
document.body.innerHTML = '<x-example></x-example>';

// Get WecComponent's instance
let xExample = document.body.querySelector('x-example');

// Subscribe to React component's event.
xExample.addEventListener('click', (event) => {
    console.log(event.detail[0]); // 'first value'
    console.log(event.detail[1]); // 'second value'
});
```

### Public methods bindings  <a href="#public-methods-bindings"></a>

Regap provides feature to bind WebComponents public methods to React components public methods.

#### Usage example

```javascript
// react-component.js
import React from 'react';

export default class ReactComponent extends React.Component {
    /**
     * @public
     */
    focus() {
        this.input.focus();
    }

    render() {
        return (
            <input ref={(input) => { this.input = input; }} />
        );
    }
}

// regap-component.js
import regap from 'regap';
import ReactComponent from './react-component';

regap('x-example', ReactComponent, {
    // Place your public methods description to `methods` object. Use property name as public method name and
    // provide `name` key to describe React component's public method name.
    methods: {
        focus: {
            name: 'focus'
        }
    }
});

// Render WebComponent to body
document.body.innerHTML = '<x-example></x-example>';

// Get WecComponent's instance
let xExample = document.body.querySelector('x-example');

// Call React component's public method.
xExample.focus();
```

### Slots <a href="#slots"></a>

Regap provides feature to reflect WebComponents slots to React components props.

```javascript
// react-component.js
import React from 'react';

export default class ReactComponent extends React.Component {
    static propTypes = {
        someOtherChildren: React.PropTypes.node
    };

    render() {
        return (
            <div>
                {this.props.children}
                <span>{this.props.someOtherChildren}</span>
            </div>
        );
    }
}

// regap-component.js
import regap from 'regap';
import ReactComponent from './react-component';

regap('x-example', ReactComponent, {
    // Place your slots description to `slots` object. Use property name as slot name and
    // provide `name` key to describe React component's prop name.
    //
    // Regap provides slot `children` by default.
    slots: {
        'some-other-children': {
            name: 'someOtherChildren'
        }
    }
});

// Render WebComponent to body
document.body.innerHTML =
    '<x-example>' +
        'Some children content' +
        '<span slot="some-other-children">' +
            'Some other children content' +
        '</span>'
    '</x-example>';
```
