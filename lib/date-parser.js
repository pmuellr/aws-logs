'use strict'

exports.parse = parse

// Parses a string and returns a Date object.
// The following formats are accepted:
//   ISO date substring
//   unix epoch ms value
//   number < 1000 indicating hours since current time
function parse (string) {
  const isoish = /^\d\d\d\d-\d\d-\d\d.*/.test(string)
  if (isoish) return parseISO(string)

  return parseNumber(string)
}

// parse a number as an unix epoch ms value or relative number
function parseNumber (string) {
  const number = parseInt(string, 10)
  if (isNaN(number)) return null

  if (number > 1000) return new Date(number)

  const now = new Date().getTime()
  return new Date(now - 1000 * 60 * 60 * number)
}

// parse a string as an ISO date
function parseISO (string) {
  // Date.parse() doesn't handle yyyy-mm-ddThh, so make fudge that one
  const onlyHours = /^\d\d\d\d-\d\d-\d\dT\d\d$/.test(string)
  if (onlyHours) string = `${string}:00`

  const unixEpoch = Date.parse(string)
  if (isNaN(unixEpoch)) return null
  return new Date(unixEpoch)
}
