#!/usr/bin/env node
const fn = require('./cli-funcs');
const yargs = require('yargs');

yargs
  .wrap(Math.min(100, yargs.terminalWidth()))
  .command({
    command: 'get-charts <repo-uri> [format]',
    alias: ['gc'],
    desc: 'Get the charts from a given chart repository.',
    builder: yargs => {
      yargs.positional('repoUri', {
        type: 'string',
        describe: 'the repository Uri'
      }).positional('format', {
        type: 'string',
        describe: 'How to format the output.',
        choices: ['table', 'json'],
        default: 'table'
      })
    },
    handler: async (argv) => {
      await fn.upgradeCheck(argv);
      await fn.getRepoCharts(argv)
    }
  })
  .command({
    command: 'get-images <chart-url> [format]',
    alias: ['gi'],
    desc: 'Get docker images being used by a helm chart.',
    builder: yargs => {
      yargs.positional('chartUrl', {
        type: 'string',
        describe: 'the chart Url'
      }).positional('format', {
        type: 'string',
        describe: 'How to format the output.',
        choices: ['list', 'json'],
        default: 'list'
      })
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
  .demandCommand(1, 'You need ad least one command before moving on')
  .showHelpOnFail(false, 'Specify -help for available options')
  .help('help')
  .argv;
