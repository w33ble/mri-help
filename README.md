# mri-help

Help text generator for mri.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/mri-help/master/LICENSE)
[![Build Status](https://img.shields.io/travis/w33ble/mri-help.svg?branch=master)](https://travis-ci.org/w33ble/mri-help)
[![npm](https://img.shields.io/npm/v/mri-help.svg)](https://www.npmjs.com/package/mri-help)
[![Project Status](https://img.shields.io/badge/status-experimental-orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)

## Usage

```js
const mri = require('mri');
const mriHelper = require('mri-helper');

// set mri up with given options
const mriOptions = { ... };
const args = mri(process.argv.slice(2), mriOptions);

// if user passed --help, display help
if (args.help) {
  console.log(mriHelper(mriOptions, {
    command: 'your-cli-command',
    options: {
      // description for your mri options
    }
  }));
  reutrn;
}
```

## API

#### mriHelper(mriOptions, helpOptions)

`mriOption` is the options object you passed to mri to help it parse argument input.

`helpOptions` is an object you provide to the help text generator to allow it to produce helpful output. The `command` property is used to show your cli comman, and any `options` act as descriptions for the mri options you are parsing.

Return help output text.

#### License

MIT © [w33ble](https://github.com/w33ble)