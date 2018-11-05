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
        describe: 'the chart Url'
      });
    },
    handler: (argv) => {
      fn.getImages(argv);
    }
  })
  .command({
    command: 'get-charts <repo-uri> [format]',
    alias: ['gc'],
    desc: 'Get the charts from a given chart repository.',
    builder: yargs => {
      yargs.positional('repoUri', {
        type: 'string',
        describe: 'the repository Uri'
      })
    },
    handler: (argv) => {
      fn.getRepoCharts(argv)
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
    choices: ['table', 'json'],
    default: 'table'
  })
  .demandCommand(1, 'You need ad least one command before moving on')
  .showHelpOnFail(false, 'Specify -help for available options')
  .help('help')
  .argv;
