'use strict'

// initialize
function init () {
  exports.print = print
}

const yieldCallback = require('yield-callback')

const utils = require('./utils')

const Logger = require('./logger').getLogger()
const CloudWatchLogs = utils.CloudWatchLogs

// print log events for a specific group and streams
// cb(err)
const print = yieldCallback(function * (logGroupName, logStreamNames, opts, ycb) {
  const params = {
    logGroupName: logGroupName,
    logStreamNames: logStreamNames,
    startTime: opts.startTime,
    endTime: opts.endTime
  }

  Logger.log(`getting logEvents for ${logGroupName}:`)
  for (let logStreamName of logStreamNames) {
    Logger.log(`  ${logStreamName}`)
  }

  while (true) {
    Logger.log(`getting a batch of logEvents`)
    const data = yield CloudWatchLogs.filterLogEvents(params, ycb)
    if (ycb.err) return ycb.err
    if (data.events == null || data.events.length === 0) return

    data.events
      .map(event => opts.wholeEvent ? JSON.stringify(event) : event.message)
      .forEach(event => console.log(event))

    if (data.nextToken == null) return
    params.nextToken = data.nextToken
  }
})

// initialize
init()
