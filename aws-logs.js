#!/usr/bin/env node

'use strict'

exports.cli = cli

// Gets AWS log entries from the ncm registry proxy servers.

const DefaultTimeStart = '24'
const DefaultTimeEnd = new Date().toISOString()

const fs = require('fs')
const path = require('path')

const minimist = require('minimist')
const yieldCallback = require('yield-callback')

const pkg = require('./package.json')
const dateParser = require('./lib/date-parser')
const logEvents = require('./lib/log-events')
const logGroups = require('./lib/log-groups')
const logStreams = require('./lib/log-streams')
const CloudWatchLogs = require('./lib/CloudWatchLogs')

const Logger = require('./lib/logger').getLogger()

// main function
function cli () {
  // parse args
  const minimistOpts = {
    string: ['timeStart', 'timeEnd', 'region'],
    boolean: ['debug', 'quiet', 'wholeEvent', 'help', 'version'],
    alias: {
      s: 'timeStart',
      e: 'timeEnd',
      w: 'wholeEvent',
      r: 'region',
      d: 'debug',
      q: 'quiet',
      h: 'help',
      v: 'version'
    }
  }

  const argv = minimist(process.argv.slice(2), minimistOpts)

  // check for help and version options
  if (argv.version) version()
  if (argv.help) help()
  if (argv._.length === 0) help()

  // set region
  if (argv.region) {
    CloudWatchLogs.setRegion(argv.region)
  }

  // set logger quiet value
  if (argv.quiet) {
    Logger.quiet(true)
  }

  // set logger debugging value
  if (argv.debug || process.env.DEBUG != null || process.env.LOGLEVEL === 'debug') {
    Logger.debugging(true)
  }

  // set up cmd, args, opts
  const cmd = argv._.shift()
  const args = argv._

  const opts = {
    timeStart: argv.timeStart || DefaultTimeStart,
    timeEnd: argv.timeEnd || DefaultTimeEnd,
    wholeEvent: !!argv.wholeEvent
  }

  // convert / validate opts
  opts.timeStart = dateParser.parse(opts.timeStart)
  opts.timeEnd = dateParser.parse(opts.timeEnd)

  if (opts.timeStart == null) {
    Logger.log(`invalid timeStart option ${argv.timeStart}`)
    process.exit(1)
  } else {
    opts.timeStart = opts.timeStart.getTime()
  }

  if (opts.timeEnd == null) {
    Logger.log(`invalid timeEnd option ${argv.timeEnd}`)
    process.exit(1)
  } else {
    opts.timeEnd = opts.timeEnd.getTime()
  }

  Logger.debug(`calculated timeStart: ${new Date(opts.timeStart)}`)
  Logger.debug(`calculated timeEnd:   ${new Date(opts.timeEnd)}`)

  // validate args
  const argsLen = args.length

  if (cmd === 'list-groups') {
    if (argsLen !== 0 && argsLen !== 1) {
      Logger.log('the list-groups command expects zero or one argument')
      process.exit(1)
    }

    checkRegexes(args)
  }

  if (cmd === 'list-streams') {
    if (argsLen !== 1 && argsLen !== 2) {
      Logger.log('the list-streams command expects one or two arguments')
      process.exit(1)
    }

    checkRegexes(args)
  }

  if (cmd === 'get') {
    if (args.length !== 2) {
      Logger.log('the get command expects two arguments')
      process.exit(1)
    }

    checkRegexes(args)
  }

  // run the command
  const timeStart = Date.now()

  if (cmd === 'get') return cmdGet(args, opts, cmdCB)
  if (cmd === 'list-groups') return cmdListGroups(args, opts, cmdCB)
  if (cmd === 'list-streams') return cmdListStreams(args, opts, cmdCB)

  help()

  function cmdCB (err) {
    const timeElapsed = Math.round((Date.now() - timeStart) / 1000)
    Logger.log(`elapsed time: ${timeElapsed} seconds`)
    if (err) Logger.log(err)
  }
}

// ensure regexes are valid
function checkRegexes (args) {
  let errors = 0

  for (let arg of args) {
    const regex = glob2regex(arg)
    if (regex instanceof Error) {
      errors++
      Logger.log(`invalid regex: "${arg}" - ${regex}`)
    }
  }

  if (errors > 0) process.exit(1)
}

// handles command get
const cmdGet = yieldCallback(function * (args, opts, ycb) {
  const regexGroup = glob2regex(args[0] || '.*')
  const regexStream = glob2regex(args[1] || '.*')

  const logGroupNames = yield logGroups.list(regexGroup, ycb)
  if (ycb.err) {
    Logger.log('error getting logGroups')
    return ycb.err
  }

  for (let logGroupName of logGroupNames) {
    const logStreamNames = yield logStreams.list(logGroupName, regexStream, ycb)
    if (ycb.err) {
      Logger.log('error getting logStreams')
      return ycb.err
    }

    if (logStreamNames.length === 0) continue

    yield logEvents.print(logGroupName, logStreamNames, opts, ycb)
    if (ycb.err) {
      Logger.log('error getting logEvents')
      return ycb.err
    }
  }
})

// handles command list-groups
const cmdListGroups = yieldCallback(function * (args, opts, ycb) {
  const regex = glob2regex(args[0] || '.*')

  const logGroupNames = yield logGroups.list(regex, ycb)
  if (ycb.err) {
    Logger.log('error getting logGroups')
    return ycb.err
  }

  for (let logGroupName of logGroupNames) {
    console.log(logGroupName)
  }
})

// handles command list-streams
const cmdListStreams = yieldCallback(function * (args, opts, ycb) {
  const regexGroup = glob2regex(args[0] || '.*')
  const regexStream = glob2regex(args[1] || '.*')

  const logGroupNames = yield logGroups.list(regexGroup, ycb)
  if (ycb.err) {
    Logger.log('error getting logGroups')
    return ycb.err
  }

  for (let logGroupName of logGroupNames) {
    const logStreamNames = yield logStreams.list(logGroupName, regexStream, ycb)
    if (ycb.err) {
      Logger.log('error getting logStreams')
      return ycb.err
    }

    for (let logStreamName of logStreamNames) {
      console.log(`${logGroupName} :: ${logStreamName}`)
    }
  }
})

// Convert a string to a regex; if string has no '*', surround with .*
function glob2regex (glob) {
  if (glob.indexOf('*') === -1 && glob.indexOf('^') === -1 && glob.indexOf('$') === -1) {
    glob = `.*${glob}.*`
  }

  try {
    return new RegExp(glob, 'i')
  } catch (err) {
    return err
  }
}

// print version and exit
function version () {
  console.log(pkg.version)
  process.exit(0)
}

// print help and exit
function help () {
  console.log(getHelp())
  process.exit(1)
}

// get help text
function getHelp () {
  const helpFile = path.join(__dirname, 'HELP.md')
  let helpText = fs.readFileSync(helpFile, 'utf8')

  helpText = helpText.replace(/%%program%%/g, pkg.name)
  helpText = helpText.replace(/%%version%%/g, pkg.version)

  return helpText
}

// run cli if invoked as main module
if (require.main === module) cli()
