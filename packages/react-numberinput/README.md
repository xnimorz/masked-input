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

## react-numberinput

Component that allow to format only numbers. (5 000, 123 456 789, etc.)

React number input was tested on desktop and mobile browsers:

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
npm install --save react-numberinput
```

or

```
yarn add react-numberinput
```

This component work on top of react-maskinput and define custom formatting function called `reformat`. Also you can use this component as example to create you own components based on react-maskinput.

### Usage

```javascript
import NumberInput from 'react-numberinput';

ReactDOM.render(someElement, <NumberInput />);
```

You also can set up different input element properties, such as class, data-attributes, etc.
This component works well with another libraries, styled-components as example:

```javascript
import React, { Component } from 'react';
import MaskInput from 'react-maskinput';
import NumberInput from 'react-numberinput';

const StyledNumberInput = styled(NumberInput)`
  border-radius: 10px;
  border-color: rgb(219, 112, 147);
`;

render(<StyledNumberInput />);
```

### Props

All of passed props is applying to `react-maskedinput` directly. See `react-maskinput` for more information. Note if you using `reformat`
function `maskChar`, `maskString`, `mask` will be ignored.

# Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -m 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request

# Changelog

1.0.0 several changes:

- From this moment all of tools will have similar version
- Added examples using components with another libs, such as `styled-components`
- Improved demo page
- Improved readme

  0.1.9 Use input-core@0.1.2, react-maskinput@0.1.8

  0.1.8 Add iOS@9 support

  0.1.7 Fix minor bug with backspace

  0.1.6 Do not remove leading zeros while input is editing

  0.1.3 Add onFocus and onBlur callbacks. Add getReference function to examples

  0.1.2 Add android support, remove transform-react-jsx from mask-input build

  0.1.1 Remove "0" on start

  0.1.0 First publish

# TODO

1.  Cover all input-core with unit tests
2.  Dynamically change props in demo page

# License

MIT
