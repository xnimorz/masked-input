[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Mask input with simple API and rich customization.

You often have to create input for a credit card, phone number, birthday, etc. Each of this usecases requires to input value with some formatting (for example `0000-0000-000-0000` for credit card).

This project could help you in all this situations!

Watch demo: http://xnimorz.github.io/masked-input/

## How to start

If you need to create a credit card input, phone, date or similar use (inside the link you'll find step-by-step guide)

- [react-maskinput](https://github.com/xnimorz/masked-input/tree/master/packages/react-maskinput) for React,
- [svelte-mask-input](https://github.com/xnimorz/svelte-mask-input) for Svelte
- [mask-input](https://github.com/xnimorz/vanilla-masked-input) if you don't use any framework

These projects support rich customization.

If you need to create a number formatter:

- [react-numberinput](#section-react-numberinput) for React

## Components

- [svelte-mask-input](https://github.com/xnimorz/svelte-mask-input) — Svelte mask input;
- [react-maskinput](https://github.com/xnimorz/masked-input/tree/master/packages/react-maskinput) — react masked input;
- [react-numberinput](https://github.com/xnimorz/masked-input/tree/master/packages/react-numberinput) — react numeric input;
- [mask-input](https://github.com/xnimorz/vanilla-masked-input) — vanilla mask input;
- [input-core](https://github.com/xnimorz/masked-input/tree/master/packages/input-core) — the core module with rich and clear API on top of which you can build any custom components.

React components and input-core is written on TypeScript, so it helps you to use them.

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -m 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request

## F.A.Q

1. Browsers support

React masked input and numeric input were tested on desktop and mobile browsers:

- Desktop browsers:

* [x] Safari >= 9
* [x] Google Chrome
* [x] EDGE, IE11
* [x] Mozilla Firefox
* [x] Opera, Yandex.browser etc.

- Mobile browsers:

* [x] Android Chrome
* [x] Safari IOS >= 9
* [] Android browser <= v4 — there are some artifacts with copy & paste

# License

MIT
