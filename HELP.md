%%program%% %%version%% - print AWS log groups, streams, and events

usage:

    %%program%% <[options]> list-groups <[group]>
    %%program%% <[options]> list-streams [group] <[stream]>
    %%program%% <[options]> get [group] [stream]

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
