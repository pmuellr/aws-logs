aws-logs - print AWS log groups, streams, and events
================================================================================


usage
--------------------------------------------------------------------------------

    aws-logs <[options]> list-groups <[group]>
    aws-logs <[options]> list-streams [group] <[stream]>
    aws-logs <[options]> get [group] [stream]

The first form lists the log groups available.  An optional group parameter
will filter the log groups returned.

The second form lists the log streams available for the specified log groups.
An optional stream parameter will filter the log streams returned.

The third form will get the events for the specified log groups and log streams.

[group] and [stream] are regex expressions string describing log group(s) or
log streams.  If the expression does not contain the `*`, `^`, or `$`
characters, the expression will be surrounded with `.*`.  Eg, calling with
`mygroup` would end up with regex `.*mygroup.*`.  Regex's are built using
the case insensitive matching flag.

options:

    -s --timeStart [date]  date for earliest log events (default: now - 24hr)
    -e --timeEnd [date]    date for latest log events (default: now)
    -w --wholeEvent        print whole event instead of event.message
    -r --region            AWS region
    -d --debug             generate debugging messages
    -q --quiet             do not print status messages to stderr
    -h --help              print this help
    -v --version           print the program version

The date value can be in one of several forms:

* valid ISO date substring:
  * `yyyy-mm-dd`
  * `yyyy-mm-ddThh`
  * `yyyy-mm-ddThh:mm`
  * `yyyy-mm-ddThh:mm:ss`
* unix epoch ms
* number of hours before current time

The region option will set the AWS region to operate on.  If not set, the
region will be set from the first value available from:

* environment variable `AWS_LOGS_REGION`
* environment variable `AWS_DEFAULT_REGION`
* `us-west-2`

Debug logging is enabled with either the `--debug` flag, or having the
environment variable `DEBUG` set to anything, or the environment variable
`LOGLEVEL` set to `debug`.

install
================================================================================

To install the `aws-logs` command globally, run:

    npm install -g pmuellr/aws-logs


license
================================================================================

This package is licensed under the MIT license.  See the
[LICENSE.md](LICENSE.md) file for more information.


changelog
================================================================================

2017-04-03 - version 1.0.5

* cut down some of the logging
* filter streams searched by date searched

2017-03-23 - version 1.0.4

* print calculated region with debug log

2017-03-22 - version 1.0.3

* add --region option

2017-03-22 - version 1.0.2

* change default start time from 1 to 24 hours from now

2017-03-22 - version 1.0.1

* add --debug flag

2017-03-22 - version 1.0.0

* initial version


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
