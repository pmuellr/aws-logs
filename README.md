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
An optional stream parameter will filter the log streams returned

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


install
================================================================================

To install the `aws-logs` command globally, run:

    npm install -g pmuellr/aws-logs


license
================================================================================

This package is licensed under the MIT license.  See the
[LICENSE.md](LICENSE.md) file for more information.


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
