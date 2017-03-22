'use strict'

const dateParser = require('../lib/date-parser')

const utils = require('./lib/utils')

const runTest = utils.createTestRunner(__filename)

runTest(testISO)
runTest(testUnixEpoch)
runTest(testRelativeHours)

// test ISO dates
function testISO (t) {
  let expected
  let actual

  expected = new Date('2017-03-22T00:00:00')
  actual = dateParser.parse('2017-03-22')
  datesEqual(t, expected, actual, 'handles ISO subset with date')

  expected = new Date('2017-03-22T01:00:00')
  actual = dateParser.parse('2017-03-22T01')
  datesEqual(t, expected, actual, 'handles ISO subset with hours')

  expected = new Date('2017-03-22T01:02:00')
  actual = dateParser.parse('2017-03-22T01:02')
  datesEqual(t, expected, actual, 'handles ISO subset with minutes')

  expected = new Date('2017-03-22T01:02:03')
  actual = dateParser.parse('2017-03-22T01:02:03')
  datesEqual(t, expected, actual, 'handles ISO subset with seconds')

  t.end()
}

// test unix epoch
function testUnixEpoch (t) {
  let expected
  let actual

  expected = new Date('2017-03-22T14:15:29.109Z')
  actual = dateParser.parse('1490192129109')
  datesEqual(t, expected, actual, 'handles unix epoch dates')

  t.end()
}

// test relative hours
function testRelativeHours (t) {
  let expected
  let actual

  expected = new Date(new Date().getTime() - 1000 * 60 * 60)
  actual = dateParser.parse('1')
  datesEqual(t, expected, actual, 'handles relative hours')

  t.end()
}

// test if two dates are equal
function datesEqual (t, d1, d2, msg) {
  if (!(d1 instanceof Date)) {
    return t.fail(`${msg}: expecting first parameter to be date, but was ${d1}`)
  }

  if (!(d2 instanceof Date)) {
    return t.fail(`${msg}: expecting second parameter to be date, but was ${d2}`)
  }

  // ignore ms values on compared dates
  const d1ISO = d1.toISOString().substr(0, 19)
  const d2ISO = d2.toISOString().substr(0, 19)
  t.equal(d1ISO, d2ISO, msg)
}
