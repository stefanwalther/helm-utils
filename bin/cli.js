#!/usr/bin/env node
const fn = require('./cli-funcs');
const yargs = require('yargs');

yargs
  .command({
    command: 'get-images <chart-url> [format]',
    alias: ['gi'],
    desc: 'Get docker images being used by a helm chart.',
    builder: yargs => {
      yargs.positional('chartUrl', {
        type: 'string',
        describe: 'the repo'
      });
    },
    handler: (argv) => {
      fn.getImages(argv);
    }
  })
  .option('verbose', {
    type: 'boolean',
    alias: ['v'],
    default: false
  })
  .option('format', {
    type: 'string',
    describe: 'How to format the output',
    choices: ['verbose', 'json'],
    default: 'verbose'
  })
  .demandCommand(1, 'You need ad least one command before moving on')
  .showHelpOnFail(false, 'Specify -help for available options')
  .help('help')
  .argv;
