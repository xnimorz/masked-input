## react-maskinput

DEMO: https://xnimorz.github.io/masked-input/

Mask input with simple API and rich customization.

You often have to create input for a credit card, phone number, birthday, etc. Each of this usecases requires to input value with some formatting (for example 0000-0000-000-0000 for credit card).

react mask input could solve this problem without the tears.

### Installation

```noeditor
npm install --save react-maskinput
```

or if you use `yarn`

```noeditor
yarn add react-maskinput
```

### Usage

You can try all of this examples here: https://xnimorz.github.io/masked-input/

The most simple usage is a credit card (click to the `show code` button):

```js
import MaskInput from 'react-maskinput';

<MaskInput alwaysShowMask maskChar="_" mask="0000-0000-0000-0000" size={20} />;
```

### Other use cases:

All this examples you can try here: https://xnimorz.github.io/masked-input/

#### Credit card:

All props you can change right during the runtime.
Credit card with automatic switching between visa and american express format (for amex format write 34 or 37):

```js
import MaskInput from 'react-maskinput';
const [mask, setMask] = React.useState('0000-0000-0000-0000');

const onChange = e => {
  if (e.target.value.indexOf('34') === 0 || e.target.value.indexOf('37') === 0) {
    setMask('0000-000000-00000');
    return;
  }

  setMask('0000-0000-0000-0000');
};

<MaskInput onChange={onChange} maskChar="_" mask={mask} alwaysShowMask size={20} />;
```

#### Date

Date input with custom year (2 or 4 numbers):

```js
import MaskInput from 'react-maskinput';
const [mask, setMask] = React.useState('00.00.0000');
const [maskString, setMaskString] = React.useState('DD.MM.YYYY');
const onChange = e => {
  if (parseInt(e.target.value[6], 10) > 2) {
    setMaskString('DD.MM.YY');
    setMask('00.00.00');
  } else {
    setMaskString('DD.MM.YYYY');
    setMask('00.00.0000');
  }
};
<MaskInput alwaysShowMask onChange={onChange} maskString={maskString} mask={mask} size={20} />;
```

You can use any regular input fields, like placeholder:

```js
import MaskInput from 'react-maskinput';
const [mask, setMask] = React.useState('00.00.0000');
const [maskString, setMaskString] = React.useState('DD.MM.YYYY');
const onChange = e => {
  if (parseInt(e.target.value[6], 10) > 2) {
    setMaskString('DD.MM.YY');
    setMask('00.00.00');
  } else {
    setMaskString('DD.MM.YYYY');
    setMask('00.00.0000');
  }
};
<MaskInput
  onChange={onChange}
  maskString={maskString}
  mask={mask}
  size={35}
  showMask
  placeholder="Enter your birthdate DD.MM.YYYY"
/>;
```

#### Phone:

The USA phone format:

```js
import MaskInput from 'react-maskinput';

<MaskInput
  alwaysShowMask
  mask={'+1 (000) 000 - 0000'}
  size={20}
  showMask
  maskChar="_"
  placeholder="Enter your birthdate DD.MM.YYYY"
/>;
```

### Customization:

You can use defaultValue to set up componant as uncontrolled input:

```js
import MaskInput from 'react-maskinput';

<MaskInput alwaysShowMask maskChar="_" mask="0000-{0}-0000" defaultValue="123456789" />;
```

In onChange | onChangeValue callback you can receive on processing value.
This example also shows how to create controlled input:

```js
import MaskInput from 'react-maskinput';
const [onChange, setOnChange] = React.useState('');
const [onValueChange, setOnValueChange] = React.useState('');
<div>
  <p>Value from onChange event is: "{onChange}"</p>
  <p>Value from onChange with replace is: "{onChange.replace('-', '')}"</p>
  <p>maskedValue from onValueChange is: "{onValueChange.maskedValue}"</p>
  <p>Value from onValueChange is: "{onValueChange.value}"</p>
  <MaskInput
    onChange={e => setOnChange(e.target.value)}
    onValueChange={setOnValueChange}
    mask={'0000-0000'}
    value={onChange}
    size={20}
  />
</div>;
```

Custom classes:

```js
import MaskInput from 'react-maskinput';
<MaskInput className="custom-input" alwaysShowMask maskString="0000-(TEXT)-0000" mask="0000-(aaaa)-0000" />;
```

Get HTMLElement from the component:

```js
import MaskInput from 'react-maskinput';
const [el, setEl] = React.useState(null);
<div>
  <p>
    <code>el is: `{el && el.outerHTML}`</code>
  </p>
  <MaskInput
    getReference={el => setEl(el)} /* Now in el is storing input HtmlElement */
    alwaysShowMask
    size={20}
    maskChar="_"
    mask="0000-0000-0000"
  />
</div>;
```

### Props

List of specific react-maskinput props:

`mask`: String. Format:

```
   0 — any number 0-9
   * — any symbol
   a — A-Z, a-z
   q — "q" letter, 2 — "2" letter etc.
   \a — "a" letter
 default is undefined
```

[function] `reformat`: user function, if you want use custom reformat logic. It's userfull for numeric inputs, decimal numbers, emails, etc.
If `reformat` defined `mask` will be ignored. Reformat function must receive object with several fields:

```javascript
function reformat({value: string, selection: {start, end}, input: string}) {
    // realization

    return {
        [any] value: // value that stored and called in input core functions (such as reformat). Field may have any format,
        [String] visibleValue: // value that displayed to user in input if showMask is false,
        [String] maskedValue: // value that  displayed to user in input if showMask is true,
        [{[integer] start, [integer] end}] selection: {start, end} — // new selection range
    }
}
```

If `reformat` and `mask` is undefined, input allows to enter any values.

You can define custom mask by passing `maskFormat`. This prop must be an array,
each object in array have several fields:

- `str`: matched char for mask
- `regexp`: validation rule as regexp
- `type`: special

`maskChar`: Character to cover unfilled editable parts of mask. Default value is ''.
`maskString`: String to cover unfilled editable parts of mask. Default is undefined. If `maskString` define `maskChar` ignored.

`showMask`: show mask in input. It's possible only if mask have not cyclic. Default value = false
`alwaysShowMask`: show mask when input inactive

`Callbacks`:
`onChange`(event). Event is synthetic react-event. If you want access to input value, you may use: `event.target.value`  
`onValueChange`(event). fires, when value was changed. Provides 2 fields: `value` and `maskedValue`
`getReference`: Callback to get native input ref

# License

MIT

# Changelog

## 3.0.0

The code of react-maskinput was rewritten to react hooks. It should be compatible with the prevoius version (2.x), but in some complicated cases behavior could be changed.