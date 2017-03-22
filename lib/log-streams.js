'use strict'

// initialize
function init () {
  exports.list = list
}

const yieldCallback = require('yield-callback')

const utils = require('./utils')

const Logger = require('./logger').getLogger()
const CloudWatchLogs = utils.CloudWatchLogs

// get log stream names
// cb(err, string[])

const list = yieldCallback(function * (logGroupName, regex, ycb) {
  const params = {
    logGroupName: logGroupName,
    orderBy: 'LastEventTime',
    descending: true
  }

  const result = []

  while (true) {
    Logger.log(`getting a batch of logStreams for ${logGroupName}`)
    const data = yield CloudWatchLogs.describeLogStreams(params, ycb)
    if (ycb.err) return ycb.err
    if (data.logStreams == null || data.logStreams.length === 0) return result.sort()

    data.logStreams
      .map(logStream => logStream.logStreamName)
      .filter(logStreamName => regex.test(logStreamName))
      .forEach(logStreamName => result.push(logStreamName))

    if (data.nextToken == null) return result.sort()
    params.nextToken = data.nextToken
  }
})

// initialize
init()
