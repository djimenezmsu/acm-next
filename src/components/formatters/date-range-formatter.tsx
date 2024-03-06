'use client'

const dateFormatter = Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
})
const sameDayDateFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
})

export function DateRangeFormatter(
    {
        dateFrom,
        dateTo
    }: {
        dateFrom: Date
        dateTo: Date
    }
) {
    const sameDay = dateFrom.getDate() === dateTo.getDate()
        && dateFrom.getMonth() === dateTo.getMonth()
        && dateFrom.getFullYear() === dateTo.getFullYear()

    const formatter = sameDay ? sameDayDateFormatter : dateFormatter

    return (
        <time dateTime={dateFrom.toISOString()}>
            {formatter.format(dateFrom)} - {formatter.format(dateTo)}
        </time>
    )
}