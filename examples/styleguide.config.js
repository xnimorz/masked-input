const path = require('path');
module.exports = {
  sections: [
    {
      name: 'Masked Inputs',
      content: 'Intro.md',
    },
    {
      name: 'react-maskinput',
      content: 'maskInput.md',
    },
    {
      name: 'react-numberinput',
      content: 'numberInput.md',
    },
    {
      name: 'vanilla',
      content: 'vanilla.md',
    },
  ],
  require: [path.resolve(__dirname, 'index.css')],
};
