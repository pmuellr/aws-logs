'use strict'

// initialize
function init () {
  exports.list = list
}

const yieldCallback = require('yield-callback')

const CloudWatchLogs = require('./CloudWatchLogs')

const Logger = require('./logger').getLogger()

// get log stream names
// cb(err, string[])

const list = yieldCallback(function * (logGroupName, regex, opts, ycb) {
  const params = {
    logGroupName: logGroupName,
    orderBy: 'LastEventTime',
    descending: true
  }

  const result = []

  Logger.log(`getting logStreams for ${logGroupName}`)

  while (true) {
    Logger.debug(`CloudWatchLogs.describeLogStreams(${JSON.stringify(params, null, 4)}`)
    const data = yield CloudWatchLogs.describeLogStreams(params, ycb)
    if (ycb.err) return ycb.err
    if (data.logStreams == null || data.logStreams.length === 0) return result.sort()

    data.logStreams
      .filter(logStream => matchesDateRange(logStream, opts.timeStart, opts.timeEnd))
      .map(logStream => logStream.logStreamName)
      .filter(logStreamName => regex.test(logStreamName))
      .forEach(logStreamName => result.push(logStreamName))

    if (data.nextToken == null) return result.sort()
    params.nextToken = data.nextToken
  }
})

function matchesDateRange (logStream, timeStart, timeEnd) {
  if (logStream == null) return false
  if (logStream.firstEventTimestamp == null) return false
  if (logStream.lastEventTimestamp == null) return false

  if (logStream.firstEventTimestamp > timeEnd) return false
  if (logStream.lastEventTimestamp < timeStart) return false

  return true
}

// initialize
init()
