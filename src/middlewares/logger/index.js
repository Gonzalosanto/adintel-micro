export const error = (e) => {
    console.error(`\x1b[31m${e}\x1b[0m`);
}

export const warning = (w) => {
    console.warn(`\x1b[33m ${w}\x1b[0m`);
}

export const debug = (d) => {
    console.debug(`\x1b[32m${d}\x1b[0m`)
}

export const log = (d) => {
    console.log(d)
}

export const info = (i) => {
    console.info(`\x1b[37m${i}\x1b[0m`);
}
// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
// FgGray = "\x1b[90m"

// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"
// BgGray = "\x1b[100m"