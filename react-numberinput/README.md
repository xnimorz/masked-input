# Set of input tools for formatting

This project allow to create mask input easily.
In real world you often need to create input for credit card, phone number or birthday date etc. 
Each of this usecases require to input value with some formatting (for example 0000-0000-000-0000 for credit card) and with static length. This project is going to help you.

Watch demo: http://xnimorz.github.io/masked-input/

See all components at https://github.com/xnimorz/masked-input

# Components

## react-numberinput

Component that allow to format only numbers.

### Installation

```
npm install --save react-numberinput
```

This component work on top of react-maskinput and define custom formatting function called `reformat`. Also you can use this component as example to create you own components based on react-maskinput.

### Usage

```javascript
import NumberInput from 'react-numberinput';

ReactDOM.render(
    someElement, 
    <NumberInput />
)
```

### Props

All of passed props is applying to maskInput directly. See maskInput for more information. Note if you using reformat 
function maskChar, maskString, mask will be ignored.

# Contributing

1) Fork it!
2) Create your feature branch: `git checkout -b my-new-feature`
3) Commit your changes: `git commit -m 'Add some feature'`
4) Push to the branch: `git push origin my-new-feature`
5) Submit a pull request 

# Changelog

0.1.8 Add iOS@9 support

0.1.7 Fix minor bug with backspace

0.1.6 Do not remove leading zeros while input is editing

0.1.3 Add onFocus and onBlur callbacks. Add getReference function to examples

0.1.2 Add android support, remove transform-react-jsx from mask-input build

0.1.1 Remove "0" on start

0.1.0 First publish

# TODO

1) Cover all input-core with unit tests
2) Dynamically change props in demo page

# License

MIT

