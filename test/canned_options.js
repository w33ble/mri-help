'use strict';

const test = require('tape');
const mri = require('mri');
const help = require('..');
const utils = require('./utils');

test('canned version description', t => {
  t.plan(1);
  const opts = { boolean: ['version'] };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  // version line is the 4th line in the output
  const parts = utils.parseOption(out.output.split('\n')[3]);
  t.equal(parts.description, 'Display the version', 'has canned description');
});

test('canned version with alias', t => {
  t.plan(2);
  const opts = { boolean: ['version'], alias: { version: ['v'] } };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  // version line is the 4th line in the output
  const parts = utils.parseOption(out.output.split('\n')[3]);
  t.equal(parts.description, 'Display the version', 'has canned description');
  t.deepEqual(parts.options, ['--version', '-v'], 'has alias option');
});

test('canned version with custom description', t => {
  t.plan(1);
  const customDesc = 'can haz version';
  const opts = { boolean: ['version'], help: { version: customDesc } };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  // version line is the 4th line in the output
  const parts = utils.parseOption(out.output.split('\n')[3]);
  t.equal(parts.description, customDesc, 'uses custom description');
});
