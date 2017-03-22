'use strict'

exports.getLogger = getLogger

const chalk = require('chalk')

// force chalk on if stderr is a tty (turns off if stdout isn't a tty)
if (process.stderr.isTTY) chalk.enabled = true

// return a new logger
function getLogger () {
  return GlobalLogger
}

// logger object
class Logger {
  constructor () {
    this.isQuiet = false
  }

  log (message) {
    if (this.isQuiet) return

    console.error(`${chalk.green(getTime())} - ${chalk.yellow(message)}`)
  }

  quiet (aBoolean) {
    if (aBoolean == null) return this.isQuiet
    this.isQuiet = !!aBoolean
    return this.isQuiest
  }
}

// single global logger
const GlobalLogger = new Logger()

// get a printable version of the current time
function getTime () {
  let tzOffset = new Date().getTimezoneOffset() * 60 * 1000
  let date = new Date()
  date = new Date(date.getTime() - tzOffset)
  return date.toISOString().substr(5, 14).replace('T', ' ')
}
