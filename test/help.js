'use strict';

const test = require('tape');
const mri = require('mri');
const utils = require('./utils');
const help = require('..');

test('pass mri options', t => {
  t.plan(2);
  const opts = { boolean: ['version'] };
  const args = help(opts);
  t.deepEqual(args.boolean, ['version'], 'passes boolean option');
  t.ok(typeof args.unknown === 'function', 'appends unknown handler');
});

test('logs and exits 0 on help', t => {
  t.plan(5);

  const opts = { boolean: ['version'], string: ['thing'] };

  const getOutput = utils.captureOutput();
  mri(['--help'], help(opts));
  const out = getOutput();

  t.equal(out.exitCode, 0, 'exits with status code 0');

  t.ok(out.output.length > 0, 'logs help output');
  t.ok(/--thing/.test(out.output), 'includes thing flag');
  t.ok(/--version/.test(out.output), 'includes version flag');
  t.ok(/--help/.test(out.output), 'includes help flag');
});

test('logs and exits 1 on unknown', t => {
  t.plan(2);

  const flag = '--derp';
  const opts = { boolean: ['version'], string: ['thing'] };

  const getOutput = utils.captureOutput();
  mri([flag], help(opts));
  const out = getOutput();

  t.equal(out.exitCode, 1, 'exits with status code 1');
  t.equal(out.output, 'Unknown flag "' + flag + '". Use "--help" to see valid flags.');
});

test('calls custom unknown handler with arg', t => {
  t.plan(1);

  const flag = '--derp';
  const opts = {
    unknown: function(f) {
      t.equal(f, flag);
    },
  };

  const getOutput = utils.captureOutput();
  mri([flag], help(opts));
  getOutput();
});
