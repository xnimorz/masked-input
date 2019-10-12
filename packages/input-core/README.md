## input-core

This project would help you if:

1. You don't need to create an input for user, but only formatting to show data as a plain text
2. You want to create your own compnent which will work with inputs

### Step-by-step guide:

1. Install it

   ```
   npm install --save input-core
   ```

   or

   ```
   yarn add input-core
   ```

2. import it:

   ```js
   import { createInput } from 'input-core';
   ```

3. Create an object (for example, if we want to format phone):

```js
export default function formatPhone(value, mask) {
  const input = createInput({
    value,
    mask,
  });

  return input.getVisibleValue();
}
```

4. Use it wherever you need ;)

```js
const phone = '9651112222';
...
formatPhone(phone, '+7 (000) 000 00-00'); // returns +7 (965) 111 22-22
```

# License

MIT
