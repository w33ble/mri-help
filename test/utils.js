'use strict';

const utils = {};

utils.parseOption = function parseOption(str) {
  const parts = str.trim().split('  ');
  if (parts < 2) throw new Error('Line is not an option: ' + str);
  const desc = parts.pop();
  return { options: parts[0].split(', '), description: desc };
};

utils.replaceProps = function replaceProps(source, mock) {
  const oldSource = {};

  Object.keys(mock).forEach(function(m) {
    oldSource[m] = source[m];
    source[m] = mock[m];
  });

  return function restoreProcess() {
    Object.keys(oldSource).forEach(function(m) {
      source[m] = oldSource[m];
    });
  };
};

utils.captureOutput = function captureOutput() {
  let exitCode;
  let output = '';

  const restoreProcess = utils.replaceProps(process, {
    exit: function(code) {
      exitCode = code;
    },
  });

  const restoreConsole = utils.replaceProps(console, {
    log: function(log) {
      output = output + log;
    },
  });

  return function getOutput() {
    restoreProcess();
    restoreConsole();
    return { exitCode, output };
  };
};

module.exports = utils;
