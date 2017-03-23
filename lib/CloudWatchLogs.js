'use strict'

// shim for AWS CloudWatchLogs functions

exports.setRegion = setRegion
exports.describeLogGroups = describeLogGroups
exports.describeLogStreams = describeLogStreams
exports.filterLogEvents = filterLogEvents

// Turns out that AWS SDK sometimes calls the callback on functions on the
// same tick - at least for input parameter errors.  Zalgo!  This is a
// particular problem for yield-callback usage, which REQUIRES the callback
// to be run on a further tick.
//
// Thus, we setImmediate() all the things ...

const DefaultRegion = 'us-west-2'

const AWS = require('aws-sdk')

const Logger = require('./logger').getLogger()

// use a region from env var or use default
let CloudWatchLogs

// set the region
function setRegion (region) {
  if (region == null) {
    region = process.env.AWS_LOGS_REGION || process.env.AWS_DEFAULT_REGION || DefaultRegion
  }

  Logger.debug(`AWS region: ${region}`)

  CloudWatchLogs = new AWS.CloudWatchLogs({
    apiVersion: '2014-03-28',
    region: region
  })
}

// shim for CloudWatchLogs.describeLogGroups()
function describeLogGroups (params, cb) {
  setImmediate(() => CloudWatchLogs.describeLogGroups(params, cb))
}

// shim for CloudWatchLogs.describeLogStreams()
function describeLogStreams (params, cb) {
  setImmediate(() => CloudWatchLogs.describeLogStreams(params, cb))
}

// shim for CloudWatchLogs.filterLogEvents()
function filterLogEvents (params, cb) {
  setImmediate(() => CloudWatchLogs.filterLogEvents(params, cb))
}
