import { DateFormatter } from "@/components/formatters/date-formatter"
import { DateRangeFormatter } from "@/components/formatters/date-range-formatter"
import { DateFormatterMode } from "@/components/formatters/types"
import { BaseButton } from "@/components/material/base-button"
import { Divider } from "@/components/material/divider"
import { FilledButton } from "@/components/material/filled-button"
import { Icon } from "@/components/material/icon"
import { PageSelector } from "@/components/page-selector"
import { AccessLevel, Event, FilterDirection, Semester } from "@/data/types"
import { filterEvents } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import Link from "next/link"
import QRCode from "react-qr-code"

const showQRCodeMinAccessLevel = AccessLevel.OFFICER
export const createEventMinAccessLevel = AccessLevel.OFFICER

const entriesPerPage = 10

export default async function EventsPage(
    {
        params,
        searchParams
    }: {
        params: {
            lang: Locale
        },
        searchParams: {
            page: string
        }
    }
) {
    const langDict = await getDictionary(params.lang)

    // get session & access level
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    // parse search params
    const currentPage = Math.max(Number.parseInt(searchParams.page) || 0, 0) // parse the page search parameter, ensuring that it is >= 1

    // get past & future events
    const dateNow = new Date()

    // get the most recent upcoming event to display at the top of the page
    const upcomingEvent = (await filterEvents({
        fromDate: dateNow,
        minAccessLevel: accessLevel,
        direction: FilterDirection.ASCENDING,
        maxEntries: 1
    })).results[0] as Event | null

    // check whether the upcoming event is in progress
    const upcomingEventInProgress = upcomingEvent ? (dateNow >= upcomingEvent.startDate && upcomingEvent.endDate > dateNow) : false

    // get events in the future only if we're on the first page.
    const futureEvents = currentPage === 0 ? await filterEvents({
        fromDate: dateNow,
        minAccessLevel: accessLevel,
        offset: 1,
        direction: FilterDirection.ASCENDING
    }) : undefined

    const currentOffset = currentPage * entriesPerPage
    const pastEvents = await filterEvents({
        toDate: dateNow,
        minAccessLevel: accessLevel,
        maxEntries: entriesPerPage,
        offset: currentOffset
    })

    return (
        <article className="w-full flex flex-col gap-5">
            <section className="flex gap-5 items-end">
                <h1 className="text-on-surface md:text-5xl text-4xl font-bold w-full">{langDict.events_title}</h1>
                {accessLevel >= createEventMinAccessLevel ? <FilledButton text={'Create'} href='./events/create' /> : undefined}
            </section>
            <Divider />

            {upcomingEvent ? (
                <section className="flex sm:flex-row flex-col gap-5 p-6 bg-primary text-on-primary rounded-3xl items-center h-fit">
                    <section className="flex-1 flex gap-3 h-full flex-col justify-center">
                        <Link href={`./events/${upcomingEvent.id}`} className="text-4xl sm:text-left text-center font-bold text-inherit hover:text-primary-container transition-colors">{upcomingEvent.title}</Link>
                        {upcomingEventInProgress ?
                            accessLevel >= showQRCodeMinAccessLevel ? (
                                <EventFields event={upcomingEvent} className="justify-start mt-2" fieldClassName="flex-row-reverse" />
                            ) : (
                                <section className="flex-1 flex-col justify-end">
                                    <BaseButton text={langDict.events_attend} href={`/api/events/attend?id=${upcomingEvent.id}`} className="w-fit mt-2 bg-on-primary text-primary before:bg-on-primary" />
                                </section>
                            ) : undefined}
                    </section>
                    {upcomingEventInProgress && accessLevel >= showQRCodeMinAccessLevel ? (
                        <QRCode className="w-full h-full max-w-56 max-h-56 p-3 bg-white rounded-3xl" value={`/api/events/attend?id=${upcomingEvent.id}`} />
                    ) : (
                        <EventFields event={upcomingEvent} className="sm:items-end items-center justify-center" />
                    )}
                </section>
            ) : undefined}

            {/* Future Events */}
            {futureEvents && futureEvents.results.length > 0 ? (
                <ul className="flex flex-col gap-5 w-full">{futureEvents.results.map(event => <FutureEventItem
                    key={event.id}
                    event={event}
                />)}
                </ul>
            ) : undefined}

            {/* Past Events */}
            {pastEvents.totalCount === 0 && !upcomingEvent ? <h2 className="w-full text-center text-4xl font-bold mt-5">{langDict.events_empty}</h2>
                : (
                    <ul className="flex flex-col gap-5 w-full">{pastEvents.results.map(event => <PastEventItem
                        key={event.id}
                        event={event}
                    />)}
                    </ul>
                )
            }

            <PageSelector
                currentOffset={currentOffset}
                totalCount={pastEvents.totalCount}
                pageSize={entriesPerPage}
                href=''
            />
        </article>
    )
}

export function EventFields(
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

function FutureEventItem(
    {
        event
    }: {
        event: Event
    }
) {
    return (
        <li className="w-full flex sm:flex-row flex-col gap-3 items-center py-3 px-5 rounded-2xl bg-surface-container">
            <Link href={`./events/${event.id}`} className="text-2xl font-semibold flex-1 hover:text-primary transition-colors">{event.title}</Link>
            <section className="flex gap-2 flex-row items-center">
                <Icon icon='calendar_month' />
                <h4 className="text-xl"><DateFormatter date={event.startDate} mode={DateFormatterMode.NARROW} /></h4>
            </section>
        </li>
    )
}
function PastEventItem(
    {
        event
    }: {
        event: Event
    }
) {
    return (
        <li className="w-full flex sm:flex-row flex-col gap-3 items-center py-3 px-5 rounded-2xl border-2 border-outline ">
            <Link href={`./events/${event.id}`} className="text-2xl font-semibold flex-1 hover:text-primary transition-colors">{event.title}</Link>
            <section className="flex gap-2 flex-row items-center">
                <Icon icon='calendar_month' />
                <h4 className="text-xl"><DateFormatter date={event.startDate} mode={DateFormatterMode.NARROW} /></h4>
            </section>
        </li>
    )
}