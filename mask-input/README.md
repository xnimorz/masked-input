# Set of input tools for formatting

This project allow to create mask input easily.
In real world you often need to create input for credit card, phone number or birthday date etc. 
Each of this usecases require to input value with some formatting (for example 0000-0000-000-0000 for credit card) and with static length. This project is going to help you.

Watch demo: http://xnimorz.github.io/masked-input/

See all components at https://github.com/xnimorz/masked-input

## mask-input

If you use vanila js, without react, you can install mask-input. This component is similar to react-maskinput, but don't use react.

### Installation

```
npm install --save mask-input
```

### Usage

Mask input receive in constructor props:
```javascript
this.maskInput = new MaskInput(this.refs.maskInput, {
    mask: '0000-0000-0000-0000'
});
```

### How to change params in runtime

To change props you can use setProps method:
```javascript
this.maskInput.setProps({mask: '0000-0000'});
```

VanilaJs maskInput support all props, that support react-maskinput: https://github.com/xnimorz/masked-input/tree/master/react-maskinput

# Contributing

1) Fork it!
2) Create your feature branch: `git checkout -b my-new-feature`
3) Commit your changes: `git commit -m 'Add some feature'`
4) Push to the branch: `git push origin my-new-feature`
5) Submit a pull request 

# Changelog

0.1.2 Add android support, remove transform-react-jsx from mask-input build

0.1.1 Fix bug with removing static symbol

0.1.0 First publish

# TODO

1) Cover all input-core with unit tests
2) Dynamically change props in demo page

# License

MIT

