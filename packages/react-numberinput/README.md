## react-numberinput

DEMO: https://xnimorz.github.io/masked-input/

Component that allow to format only numbers. (`5 000`, `123 456 789`, etc.)

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

See https://github.com/xnimorz/masked-input/tree/master/packages/react-maskinput#props

# License

MIT
