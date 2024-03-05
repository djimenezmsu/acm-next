'use client'

import { DateFormatterMode } from "./types"

const longDateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
})
const narrowDateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
})
const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
})

export function DateFormatter(
    {
        date,
        mode = DateFormatterMode.LONG
    }: {
        date: Date
        mode?: DateFormatterMode
    }
) {
    const formatter = mode === DateFormatterMode.LONG ? longDateFormatter
        : mode === DateFormatterMode.NARROW ? narrowDateFormatter
            : shortDateFormatter
    return (
        <time dateTime={date.toISOString()}>
            {formatter.format(date)}
        </time>
    )
}