A react component provide interface for inputs with custom mask.
It could be a credit card, date, phone or even the email.

### Installation

```noeditor
npm install --save react-maskinput
```

or if you use `yarn`

```noeditor
yarn add react-maskinput
```

### Usage

The most simple usage is a credit card (click to the `show code` button):

```js
import MaskInput from 'react-maskinput';

<MaskInput alwaysShowMask maskChar="_" mask="0000-0000-0000-0000" size={20} />;
```

### Other use cases:

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
