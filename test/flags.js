'use strict';

const test = require('tape');
const mri = require('mri');
const utils = require('./utils');
const help = require('..');

test('includes flags without descriptions', t => {
  t.plan(4);
  const opts = { string: ['one', 'two'] };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  const one = utils.parseOption(out.output.split('\n')[3]);
  const two = utils.parseOption(out.output.split('\n')[4]);
  t.deepEqual(one.options, ['--one'], 'includes --one flag');
  t.equal(one.description, '', 'has no description');
  t.deepEqual(two.options, ['--two'], 'includes --two flag');
  t.equal(two.description, '', 'has no description');
});

test('includes flags with descriptions', t => {
  t.plan(4);
  const oneDesc = 'First option';
  const twoDesc = 'second option';
  const opts = { string: ['one', 'two'], help: { one: oneDesc, two: twoDesc } };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  const one = utils.parseOption(out.output.split('\n')[3]);
  const two = utils.parseOption(out.output.split('\n')[4]);
  t.deepEqual(one.options, ['--one'], 'includes --one flag');
  t.equal(one.description, oneDesc, 'has custom one description');
  t.deepEqual(two.options, ['--two'], 'includes --two flag');
  t.equal(two.description, twoDesc, 'has custom two description');
});

test('include flag aliases', t => {
  t.plan(4);

  const oneDesc = 'First option';
  const opts = {
    string: ['one', 'two'],
    alias: {
      one: ['o', '1'],
      two: ['w'],
    },
    help: { one: oneDesc },
  };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  const one = utils.parseOption(out.output.split('\n')[3]);
  const two = utils.parseOption(out.output.split('\n')[4]);

  t.deepEqual(one.options.join('|'), '--one|-o|-1', 'includes --one flag');
  t.equal(one.description, oneDesc, 'has custom one description');
  t.deepEqual(two.options.join('|'), '--two|-w', 'includes --two flag');
  t.equal(two.description, '', 'has no two description');
});

test('includes default values', t => {
  t.plan(2);

  const opts = {
    string: ['one', 'two'],
    default: { one: 'derp', two: 'herpderp' },
    help: { one: 'Option one' },
  };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  const one = utils.parseOption(out.output.split('\n')[3]);
  const two = utils.parseOption(out.output.split('\n')[4]);

  t.ok(/\(default: derp\)$/.test(one.description), 'shows default in description');
  t.ok(/\(default: herpderp\)$/.test(two.description), 'shows default in description');
});

test('works with inverse flags', t => {
  t.plan(4);
  const opts = {
    boolean: ['check', 'watch'],
    help: {
      '!check': 'Disable the check',
      watch: 'Enable the watch',
    },
  };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  const check = utils.parseOption(out.output.split('\n')[3]);
  const watch = utils.parseOption(out.output.split('\n')[4]);
  t.deepEqual(check.options, ['--no-check'], 'includes --no-check flag');
  t.deepEqual(check.description, opts.help['!check'], 'includes check description');
  t.deepEqual(watch.options, ['--watch'], 'includes --watch flag');
  t.deepEqual(watch.description, opts.help['watch'], 'includes check description');
});
