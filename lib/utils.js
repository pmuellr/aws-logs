'use strict'

exports.CloudWatchLogs = null
exports.getProjectPath = getProjectPath

const path = require('path')

const AWS = require('aws-sdk')

exports.CloudWatchLogs = new AWS.CloudWatchLogs({
  apiVersion: '2014-03-28',
  region: 'us-west-2'
})

// the project's path name
const ProjectPath = path.dirname(__dirname)

// Return the path of a file relative to the project root if path provided.
// If path not provided, returns the project path itself.
function getProjectPath (aPath) {
  if (aPath == null) return ProjectPath

  return path.relative(ProjectPath, aPath)
}
