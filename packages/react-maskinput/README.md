# Set of input tools for formatting

This project allow to create masked inputs easily.
In real world you often need to create input for credit card, phone number or birthday date etc.
Each of this usecases require to input value with some formatting (for example 0000-0000-000-0000 for credit card). This project could help you.

Watch demo: http://xnimorz.github.io/masked-input/

# Components

- [react-maskinput](https://github.com/xnimorz/masked-input#react-maskinput) — react masked input,
- [react-numberinput](https://github.com/xnimorz/masked-input#react-numberinput) — react numeric input,
- [input-core](https://github.com/xnimorz/masked-input#input-core) — the core module on top of which you can build any custom components,
- [mask-input](https://github.com/xnimorz/vanilla-masked-input) — vanilla masked input.

## react-maskinput

A react component provide interface for creating inputs with custom mask. This component built on top of input-core.

React masked input was tested on desktop and mobile browsers:

- Desktop browsers:

* [x] Safari >= 9
* [x] Google Chrome
* [x] EDGE, IE11
* [x] Mozilla Firefox
* [x] Opera, Yandex.browser etc.

- Mobile browsers:

* [x] Android Chrome
* [x] Safari IOS >= 9

### Installation

```
npm install --save react-maskinput
```

or

```
yarn add react-maskinput
```

### Usage

Simple usage:

```javascript
import MaskInput from 'react-maskinput';

ReactDOM.render(someElement, <MaskInput alwaysShowMask maskChar="_" mask="0000-0000-0000-0000" />);
```

Changing mask in runtime, getting value on input change:

```javascript
import React, { Component } from 'react';
import { render } from 'react-dom';
import MaskInput from 'react-maskinput';

class DateInput extends Component {
  state = {
    maskString: 'DD.MM.YYYY',
    mask: '00.00.0000',
  };

  onChange = e => {
    // 2 — for example
    if (parseInt(e.target.value[6], 10) > 2) {
      this.setState({
        maskString: 'DD.MM.YY',
        mask: '00.00.00',
      });
    } else {
      this.setState({
        maskString: 'DD.MM.YYYY',
        mask: '00.00.0000',
      });
    }
  };

  render() {
    return (
      <MaskInput onChange={this.onChange} maskString={this.state.maskString} mask={this.state.mask} alwaysShowMask />
    );
  }
}

render(someElement, <DateInput />);
```

If you need to get input's HtmlElement, you could use `getReference` prop:

```javascript
import React, { Component } from 'react';
import { render } from 'react-dom';
import MaskInput from 'react-maskinput';

class SomeTopLevelComponent extends Component {
  getInputRef = el => {
    // Now we can work with HtmlElement
    this.input = el;
  };

  render() {
    return <MaskInput getReference={this.getInputRef} alwaysShowMask maskChar="_" mask="0000-0000-0000-0000" />;
  }
}

render(someElement, <DateInput />);
```

Custom formatting function. You can create custom formatting function by setting `reformat` prop.
As an example, you can see react-numberinput component:

```javascript
import React, { Component } from 'react';
import MaskInput from 'react-maskinput';

function removeSelectedRange(value, selection) {
  if (selection.start === selection.end) {
    return value;
  }

  if (selection.end < selection.start) {
    const tmp = selection.end;
    selection.end = selection.start;
    selection.start = tmp;
  }

  if (value.length > selection.start) {
    return value.slice(0, selection.start).concat(value.slice(selection.end, value.length));
  }

  return value;
}

class NumberInput extends Component {
  // In reformat function you need to set value and selection props
  reformat = ({ data, input = '', selection }) => {
    const newSelection = {
      start: selection.start,
      end: selection.end,
    };

    let value = removeSelectedRange(data.replace(/(\D)/g, text => (text === ' ' ? ' ' : '')), newSelection);
    const inputValue = input.replace(/\D/g, '');
    const oldLength = value.length;

    value = value.slice(0, newSelection.start) + inputValue + value.slice(newSelection.start, value.length);
    value = value.replace(/\s/g, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, text => `${text} `);

    let index = newSelection.start;
    if (inputValue) {
      index = Math.max(0, value.length - oldLength + index);
    }
    newSelection.end = newSelection.start = index;

    return {
      value,
      maskedValue: value,
      visibleValue: value,
      selection: newSelection,
    };
  };

  render() {
    return <MaskInput {...this.props} reformat={this.reformat} />;
  }
}

export default NumberInput;
```

### Usage with styled-components

react-maskinput, react-numberinput pass props to `input` element directly.
You can set up different input element properties: class, data-attributes, etc.
There components works well with another libraries, CSS-in-JS solutions, such as styled-components:

```javascript
import React, { Component } from 'react';
import MaskInput from 'react-maskinput';
import styled from 'styled-components';

const MaskedInput = styled(MaskInput)`
  border-radius: 10px;
  border-color: rgb(219, 112, 147);
`;

render(<MaskedInput alwaysShowMask maskChar="_" mask="0000-0000-0000-0000" />);
```

### Props

List of specific react-maskinput props:

- mask [String],
- reformat [Function],
- maskFormat [Array],
- maskChar [Empty string or String with one char],
- maskString [String],
- showMask [Boolean],
- alwaysShowMask [Boolean],
- getReference [Function],
- onChange [Function]

**Important!** All other props'll passed to `input` element directly. So you can set up class name, data attributes, etc.

Let's see what's doing each of props:

`mask`: String. Format:

```
   0 — any number 0-9
   * — any symbol
   a — A-Z, a-z
   q — "q" letter, 2 — "2" letter etc.
   \a — "a" letter
 default is undefined
```

[function] `reformat`: user function, if you want use custom reformat logic. It's userfull for numeric inputs, decimal numbers etc.
If `reformat` defined `mask` will be ignored. Reformat function must receive object with several fields:

```javascript
function reformat({data: data, selection: {start, end}, input}) {
    // realization

    return {
        [any] value: // value that stored and called in input core functions (such as reformat). Field may have any format,
        [String] visibleValue: // value that displayed to user in input if showMask is false,
        [String] maskedValue: // value that  displayed to user in input if showMask is true,
        [{[integer] start, [integer] end}] selection: {start, end} — // new selection range
    }
}
```

If `reformat` and `mask` is undefined, input allow to enter any values.

You can define custom mask by passing `maskFormat`. This prop must be an array,
each object in array have several fields:
`str`: matched char for mask
`regexp`: validation rule as regexp
`type`: special

`maskChar`: Character to cover unfilled editable parts of mask. Default value is ''.
`maskString`: String to cover unfilled editable parts of mask. Default is undefined. If `maskString` define `maskChar` ignored.

`showMask`: show mask in input. It's possible only if mask have not cyclic. Default value = false
`alwaysShowMask`: show mask when input inactive

`Callbacks`:
`onChange`(event). Event is synthetic react-event. If you want access to input value, you may use: `event.target.value`  
 `getReference`: Callback to get native input ref

# Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -m 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request

# Changelog

1.0.1

1.0.0 several changes:

- From this moment all of tools will have similar version
- Added examples using components with another libs, such as `styled-components`
- Improved demo page
- Improved readme

  0.1.8 Use input-core@0.1.2

  0.1.7 Remove reformat prop from the input element

  0.1.6 Add e.which to input event callback to support iOS@9.4

  0.1.5 Add applyValue method in case you need apply new value directly (by ref)

  0.1.3 Add onFocus and onBlur callbacks. Add getReference function to examples

  0.1.2 Add android support, remove transform-react-jsx from mask-input build

  0.1.1 Fix bug with removing static symbol

  0.1.0 First publish

# TODO

1.  Cover all input-core with unit tests
2.  Dynamically change props in demo page
3.  Add TS specs

# License

MIT
