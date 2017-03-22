'use strict'

// initialize
function init () {
  exports.list = list
}

const yieldCallback = require('yield-callback')

const utils = require('./utils')

const Logger = require('./logger').getLogger()
const CloudWatchLogs = utils.CloudWatchLogs

// get log group names
// cb(err, string[])
const list = yieldCallback(function * (regex, ycb) {
  if (regex == null) regex = /.*/

  const params = {}
  const result = []

  while (true) {
    Logger.log('getting a batch of logGroups')
    const data = yield CloudWatchLogs.describeLogGroups(params, ycb)
    if (ycb.err) return ycb.err
    if (data.logGroups == null || data.logGroups.length === 0) return result.sort()

    data.logGroups
      .map(logGroup => logGroup.logGroupName)
      .filter(logGroupName => regex.test(logGroupName))
      .forEach(logGroupName => result.push(logGroupName))

    if (data.nextToken == null) return result.sort()
    params.nextToken = data.nextToken
  }
})

// initialize
init()