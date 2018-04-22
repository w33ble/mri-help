'use strict';

function toArr(any) {
  return Array.isArray(any) ? any : any == null ? [] : [any];
}

function addArgs(args) {
  const out = {};
  toArr(args).forEach(arg => {
    out[arg] = {};
  });
  return out;
}

function padLine(line, len) {
  while (line.length < len) {
    line = line + ' ';
  }
  return line;
}

function generateOutput(parsed, help) {
  help = help || {};
  const command = help['@command'] || process.argv[1].replace(process.cwd() + '/', '');
  const descBuffer = 2;
  let lines = '\n';
  let options = [];
  let descriptions = [];
  let maxLength = 0;
  let cannedOptions = {
    version: {
      enabled: false,
      desc: 'Display the version',
    },
  };

  function addLine(opt) {
    let str = '--';

    if (help['!' + opt]) {
      // handle no prefixed flags
      str = str + 'no-' + opt;
      help[opt] = help['!' + opt];
    } else {
      str = str + opt;
    }

    parsed[opt] &&
      toArr(parsed[opt].aliases).forEach(alias => {
        if (alias.length > 1) str = str + ', --' + alias;
        else str = str + ', -' + alias;
      });

    options.push(str);
    maxLength = Math.max(str.length, maxLength);
  }

  function getDescription(desc, def) {
    desc = desc || '';
    def = def || '';

    let str = desc;
    if (def.length) {
      if (str.length) {
        str = str + ' (default: ' + def + ')';
      } else {
        str = '(default: ' + def + ')';
      }
    }

    return str;
  }

  // build the parsed options
  for (const opt in parsed) {
    // handle canned options
    if (cannedOptions[opt]) {
      cannedOptions[opt].enabled = true;
      if (help[opt]) {
        cannedOptions[opt].desc = help[opt];
      }
      continue;
    }

    // handle normal options
    addLine(opt);
    descriptions.push(getDescription(help[opt], parsed[opt].default));
  }

  // append the canned options, if they are enabled
  for (const opt in cannedOptions) {
    if (!cannedOptions[opt].enabled) continue;
    addLine(opt);
    descriptions.push(getDescription(cannedOptions[opt].desc));
  }

  // build the output header
  const sig = help['@signature'] ? help['@signature'] : '[options]';
  lines = lines + 'Usage: ' + command + ' ' + sig + '\n\n';

  if (help['@description']) {
    lines = lines + help['@description'] + '\n\n';
  }

  // append the help options
  addLine('help');
  descriptions.push('Display this help message');

  // append all the options
  lines =
    lines +
    options
      .map((o, i) => padLine('  ' + o, maxLength + 2 + descBuffer) + descriptions[i])
      .join('\n') +
    '\n';

  return lines;
}

module.exports = function parser(opts) {
  opts = opts || {};

  // unknown, string, boolean, default, alias
  const parsed = Object.assign({}, addArgs(opts.string), addArgs(opts.boolean));

  if (opts.alias !== void 0) {
    for (const i in opts.alias) {
      if (parsed[i]) parsed[i].aliases = toArr(opts.alias[i]);
      else parsed[i] = { aliases: toArr(opts.alias[i]) };
    }
  }

  if (opts.default !== void 0) {
    for (const i in opts.default) {
      if (parsed[i]) parsed[i].default = toArr(opts.default[i]);
      else parsed[i] = { default: toArr(opts.default[i]) };
    }
  }

  // function to show the help and exit
  function showHelp() {
    // eslint-disable-next-line no-console
    console.log(generateOutput(parsed, opts.help));
    process.exit(0);
  }
  opts.showHelp = showHelp; // append to returned opts

  // add an unknown opt, to handle the help flag
  const oldUnknown = opts.unknown;
  opts.unknown = arg => {
    if (arg === '--help') {
      showHelp();
      return;
    }

    if (oldUnknown) {
      oldUnknown(arg);
    } else {
      // eslint-disable-next-line no-console
      console.log('Unknown flag "' + arg + '". Use "--help" to see valid flags.');
      process.exit(1);
      return;
    }
  };

  return opts;
};
