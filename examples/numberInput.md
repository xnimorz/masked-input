A react component, that allows input formatted numbers.

### Installation

```noeditor
npm install --save react-numberinput
```

or

```noeditor
yarn add react-numberinput
```

### Usage

```js
import NumberInput from 'react-numberinput';
<NumberInput />;
```

In onChange | onValueChange event you can receive on processing value:

```js
import NumberInput from 'react-numberinput';
const [onChange, setOnChange] = React.useState('');
const [onValueChange, setOnValueChange] = React.useState('');
<div>
  <p>Value from onChange event is: "{onChange}"</p>
  <p>Value from onChange with replace is: "{onChange.replace(' ', '')}"</p>
  <p>maskedValue from onValueChange is: "{onValueChange.maskedValue}"</p>
  <p>Value from onValueChange is: "{onValueChange.value}"</p>
  <NumberInput
    onChange={e => setOnChange(e.target.value)}
    onValueChange={setOnValueChange}
    value={onChange}
    size={20}
  />
</div>;
```
