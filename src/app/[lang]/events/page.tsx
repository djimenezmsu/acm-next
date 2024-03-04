import { DateFormatter } from "@/components/formatters/date-formatter"
import { DateRangeFormatter } from "@/components/formatters/date-range-formatter"
import { FilledButton } from "@/components/material/filled-button"
import { Icon } from "@/components/material/icon"
import { AccessLevel, Event, FilterDirection, Semester } from "@/data/types"
import { filterEvents } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import Link from "next/link"
import QRCode from "react-qr-code"

const showQRCodeMinAccessLevel = AccessLevel.OFFICER

export default async function EventsPage(
    {
        params
    }: {
        params: {
            lang: Locale
        }
    }
) {
    const langDict = await getDictionary(params.lang)

    // get session & access level
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    // get past & future events
    const dateNow = new Date()
    const semester = dateNow.getMonth() > 6 ? Semester.FALL : Semester.SPRING
    const semesterStart = semester === Semester.SPRING ? new Date(dateNow.getFullYear(), 1, 1) : new Date(dateNow.getFullYear(), 7, 1)
    const semesterEnd = semester === Semester.SPRING ? new Date(dateNow.getFullYear(), 6, 30) : new Date(dateNow.getFullYear(), 12, 31)

    const futureEvents = await filterEvents({ fromDate: dateNow, toDate: semesterEnd, minAccessLevel: accessLevel, direction: FilterDirection.ASCENDING })
    const pastEvents = await filterEvents({ fromDate: semesterStart, toDate: dateNow, minAccessLevel: accessLevel })
    // handle upcoming event
    const upcomingEvent = futureEvents.shift()
    const upcomingEventInProgress = upcomingEvent ? (dateNow >= upcomingEvent.startDate && upcomingEvent.endDate > dateNow) : false

    return (
        <article className="flex flex-col gap-5 w-full">
            <h1 className="text-on-surface md:text-5xl text-4xl font-bold w-full">{langDict.events_title}</h1>
            {upcomingEvent ? (
                <section className="flex sm:flex-row flex-col gap-5 p-6 bg-primary text-on-primary rounded-3xl">
                    <section className="flex-1 flex gap-3 flex-col justify-center">
                        <Link href={`./events/${upcomingEvent.id}`} className="text-4xl sm:text-left text-center font-bold text-inherit hover:text-primary-container transition-colors">{upcomingEvent.title}</Link>
                        {upcomingEventInProgress ?
                            accessLevel >= showQRCodeMinAccessLevel ? (
                                <EventFields event={upcomingEvent} className="justify-start mt-2" fieldClassName="flex-row-reverse" />
                            ) : (
                                <section className="flex-1 flex flex-col justify-end">
                                    <FilledButton text={langDict.events_attend} href={`/api/events/attend?id=${upcomingEvent.id}`} className="w-fit mt-2 bg-on-primary text-primary before:bg-primary"/>
                                </section>
                            ) : undefined}
                    </section>
                    {upcomingEventInProgress ?
                        accessLevel >= showQRCodeMinAccessLevel ? (
                            <QRCode className="w-56 h-56 p-3 bg-white rounded-3xl" value={`/api/events/attend?id=${upcomingEvent.id}`} />
                        ) : (
                            <EventFields event={upcomingEvent} className="sm:items-end items-center justify-center" />
                        ) : undefined}
                </section>
            ) : undefined}
            

            <h3 className="text-2xl font-semibold">Future Events</h3>
            {futureEvents.map(event => {
                return (
                    <h4 key={event.id}>{event.title} | {event.startDate.toISOString()} | {event.endDate.toISOString()}</h4>
                )
            })}
            <h3 className="text-2xl font-semibold">Past Events</h3>
            {pastEvents.map(event => {
                return (
                    <h4 key={event.id}>{event.title} | {event.startDate.toISOString()} | {event.endDate.toISOString()}</h4>
                )
            })}
        </article>
    )
}

function EventFields(
    {
        event,
        className = '',
        fieldClassName
    }: {
        event: Event
        className?: string
        fieldClassName?: string
    }
) {
    return (
        <ul className={`flex flex-col gap-3 h-fit ${className}`}>
            {/* Start Date */}
            <EventField text={<DateFormatter date={event.startDate} />} icon='calendar_month' className={fieldClassName} />

            {/* Location */}
            <EventField text={event.location} icon='explore' className={fieldClassName} />

            {/* Duration */}
            <EventField text={<DateRangeFormatter dateFrom={event.startDate} dateTo={event.endDate} />} icon='schedule' className={fieldClassName} />

            {/* Type */}
            {event.type ? <EventField text={event.type.name} icon='book' className={fieldClassName} /> : undefined}
        </ul>
    )
}

function EventField(
    {
        text,
        icon,
        className = ''
    }: {
        text: React.ReactNode,
        icon: string,
        className?: string
    }
) {
    return (
        <li className={`flex items-center justify-end gap-3 ${className}`}>
            <h3 className="text-lg">{text}</h3>
            <Icon icon={icon} />
        </li>
    )
}