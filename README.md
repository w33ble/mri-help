# mri-help

Help text generator for mri.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/mri-help/master/LICENSE)
[![Build Status](https://img.shields.io/travis/w33ble/mri-help.svg?branch=master)](https://travis-ci.org/w33ble/mri-help)
[![npm](https://img.shields.io/npm/v/mri-help.svg)](https://www.npmjs.com/package/mri-help)
[![Project Status](https://img.shields.io/badge/status-experimental-orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)

## Usage

```js
const mri = require('mri');
const help = require('mri-help');

// use mri like normal, but wrap options in mri-help and (optionally) add an help parameter
const mriOptions = help({
  // ... define your mri options here, but see caveats below
  help: {
    '@command': 'your-awesome-command', // optional, sets the command shown in the usage output
    '@signature': '[options] <file>', // optional, customize the command's signature ("[options]" by default)
    '@description': 'file:  file to use', // optional
    '<flag>': 'Description', // optional, but recommended, description to use for a given flag (long form version)
  }
});

const args = mri(process.argv.slice(2), mriOptions); // get mri output
```

Now when the user provides the `--help` flag, help output is shown:

```
$ your-awesome-command --help

Usage: your-awesome-command [options] <file>

  --<arg>  Description
  --help   Display this help message

```

## API

### mriHelper(mriOptions)

`mriOption` is the [options object normally passed to mri](https://github.com/lukeed/mri#api). Additional `help` configuration can be added to enhance the help output.

Returns the `mriOptions`, with a couple of additional properties:

- `unknown` appended to handle capturing of the `--help` flag.
- `showHelp` appended to display help text and exit. Useful for when args parse correctly but don't meet your requirements.

#### mriOptions.help.@command

Used to override the command shown on the `Usage:` line. Defaults to `process.argv[1]` with the current path removed.

#### mriOptions.help.@signature

Used to override the function signature on the `Usage:` line. By default, if only shows `[options]`. It is useful to add other parameters based on your use, such as `<file>`.

#### mriOptions.help.@signature

Used to show custom description text under the usage line. This is especially useful if you are using _ args, and would like to describe how they are used.

#### mriOptions.help.*arg*

Used to provide a description for any of your arguments. The key is the long-form version of the argument (anything used in `boolean`, `string`, of `default`), and the value is the description used in the output. By default, no description text is shown.

#### mriOptions.help.*!arg*

Used to prefix flags in help with `no-`. For example, if you have a `check` option, and use `{ help: { '!check': 'Disable the check' }`, the help output will be `--no-check  Disable the check`. This is most useful when the default value is `true`.

## Caveats

`mri-help` uses the `unknown` mri option to listen for the `--help` flag and output the help body when it's seen. It will preserve your own `unknown` handler, with the exception of `--help`

As a result of using the unknown argument, there are some gotchas:

1. You must define *all* of the arguments you handle in the mri configuration object, otherwise the parser will stop. If you do not provide your own unknown handler, it will tell the user to use the `--help` flag and exit with status code 1.
1. Code execution will stop When the `--help` flag or any unknown flag is found. You can provide your own unknown handler to stop it from exiting on unknown flags, but the mri parser will return undefined.

#### License

MIT © [w33ble](https://github.com/w33ble)