'use strict';

const test = require('tape');
const mri = require('mri');
const utils = require('./utils');
const help = require('..');

test('shows usage info', t => {
  t.plan(2);
  const opts = {};

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  const usageParts = out.output.split('\n')[1].split(' ');

  t.equal(usageParts[0], 'Usage:', 'starts with usage');
  t.equal(usageParts[2], '[options]', 'has default signature');
});

test('shows usage with custom command', t => {
  t.plan(3);
  const cmd = 'be-awesome';
  const opts = { help: { '@command': cmd } };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  const usageParts = out.output.split('\n')[1].split(' ');

  t.equal(usageParts[0], 'Usage:', 'starts with usage');
  t.equal(usageParts[1], cmd, 'uses custom command');
  t.equal(usageParts[2], '[options]', 'has default signature');
});

test('shows usage with custom signature', t => {
  t.plan(3);
  const cmd = 'be-awesome';
  const sig = '[options] <file>';
  const opts = { help: { '@command': cmd, '@signature': sig } };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  const usageParts = out.output.split('\n')[1].split(' ');
  const usageSig = usageParts.slice(2).join(' ');

  t.equal(usageParts[0], 'Usage:', 'starts with usage');
  t.equal(usageParts[1], cmd, 'uses custom command');
  t.equal(usageSig, sig, 'uses custom signature');
});
