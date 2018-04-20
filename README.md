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
const mriOptions = { 
  // ... must include at least one alias, see caveats below
  // ... optional, recommended if you plan to recover, see caveats below
  help: {
    '@command': 'your-awesome-command', // optional, sets the command shown in the usage output
    '@signature': '[options] <file>', // optional, customize the command's signature ("[options]" by default)
    '<flag>': 'Description', // optional, but recommended, description to use for a given flag (long form version)
  }
};

const args = mri(process.argv.slice(2), help(mriOptions)); // get mri output
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

Returns the `mriOptions`, with `unknown` appended to handle capturing of the `--help` flag.

#### mriOptions.help.@command

Used to override the command shown on the `Usage:` line. Defaults to `process.argv[1]` with the current path removed.

#### mriOptions.help.@signature

Used to override the function signature on the `Usage:` line. By default, if only shows `[options]`. It is useful to add other parameters based on your use, such as `<file>`.

#### mriOptions.help.*arg*

Used to provide a description for any of your arguments. The key is the long-form version of the argument (anything used in `boolean`, `string`, of `default`), and the value is the description used in the output. By default, no description text is shown.

## Caveats

`mri-help` uses the `unknown` mri option to listen for the `--help` flag and output the help body when it's seen. It will preserve your own `unknown` handler, with the exception of `--help`

As a result of using the unknown argument, there are some gotchas:

1. mri only checks for unknown flags if options.unknown **and** options.alias are defined. Therefore, you must include at least one `alias` in the mri options.
1. You must define *all* of the arguments you handle in the mri configuration object, otherwise the parser will stop. If you do not provide your own unknown handler, it will tell the user to use the `--help` flag and exit with status code 1.
1. When the `--help` flag, or any unknown flag, is found, execution will stop. If the flag is unknown, it will exit with status code 1 by default.

#### License

MIT © [w33ble](https://github.com/w33ble)