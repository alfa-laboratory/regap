# Regap

Use your React components as WebComponents.

## Motivation

React is a very popular frontend framework. A lot of companies builds own UI libraries based on React.
Regap helps you to provide your React UI library as WebComponents. For example:

* It helps your designer to build prototypes just using HTML/CSS.
* It helps your 3rd party teams without special skills to build simple landing pages and etc.
* It helps your to share knoweldge to all your teams about how your UI library looks and feels.

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

### Callbacks binding <a href="#callbacks-binding"></a>

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

### Public methods binding <a href="#public-methods-binding"></a>

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

## API Reference

```javascript
/**
 * Attribute description.
 *
 * @typedef {Object} AttrOption
 * @property {String} name React component prop name
 * @property {AttrType} type Attribute type
 */

 /**
  * Callback description.
  *
  * @typedef {Object} CallbackOption
  * @property {String} onFunctionName React component callback prop name
  */

 /**
  * Public method description.
  *
  * @typedef {Object} MethodOption
  * @property {String} name React component public method name
  */

 /**
  * Slot description.
  *
  * @typedef {Object} SlotOption
  * @property {String} name React prop name
  */

/**
 * Regap component description.
 *
 * @typedef {Object} RegapComponentOptions
 * @property {Object.<AttrOption>} attrs
 * @property {Object.<CallbackOption>} callbacks
 * @property {Object.<SlotOption>} slots
 * @property {Object.<PublicMethodOption>} methods
 * @property {Function} onBeforeCreated
 * @property {Function} onAfterCreated
 * @property {Function} onBeforeAttached
 * @property {Function} onAfterAttached
 * @property {Function} onBeforeAttributeChanged
 * @property {Function} onAfterAttributeChanged
 * @property {Function} onBeforeDetached
 * @property {Function} onAfterDetached
 * @property {Object} ctor
 */

/**
 * Register WebComponent based on React component.
 *
 * @param {String} tagName Tag name
 * @param {Function} reactComponentCtor React component constructor
 * @param {RegapComponentOptions} [options] Some options
 * @returns {Function} WebComponent constructor.
 */
regap(tagName, reactComponentCtor, options = {});

/**
 * Exported Regap HTMLElement.
 *
 * @type {Object}
 */
regap.HTMLElement;

/**
 * Exported mixins collection.
 *
 * @type {Array.<Object>}
 */
regap.mixins;

/**
 * Exported predefined types collection.
 *
 * @type {Object.<AttrType>}
 */
regap.types;
```

## License

```
The MIT License (MIT)

Copyright (c) 2017 Alfa Laboratory

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
