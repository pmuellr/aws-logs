'use strict'

const utils = require('./lib/utils')

const runTest = utils.createTestRunner(__filename)

const pkg = require('../package.json')

runTest(testPackageName)
runTest(testEntryPoint)

// check the package name
function testPackageName (t) {
  t.deepEqual(pkg.name, 'aws-logs', 'package name is as expected')
  t.end()
}

// ensure the main cli entry point is available
function testEntryPoint (t) {
  const awsLogs = require('../aws-logs')

  t.ok(awsLogs.cli, 'main module exports cli function')
  t.end()
}
