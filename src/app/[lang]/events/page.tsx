import { EventCard } from "@/components/events/event-card"
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
import { isEventInProgress } from "@/lib/utils"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import Link from "next/link"

export const showQRCodeMinAccessLevel = AccessLevel.OFFICER
export const createEventMinAccessLevel = AccessLevel.OFFICER
export const createNewsMinAccessLevel = AccessLevel.OFFICER

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
    const showQR = accessLevel >= showQRCodeMinAccessLevel

    // parse search params
    const currentPage = Math.max(Number.parseInt(searchParams.page) || 0, 0) // parse the page search parameter, ensuring that it is >= 1

    // get past & future events
    const dateTimeNow = new Date()

    // get the most recent upcoming event to display at the top of the page
    const upcomingEvent = (await filterEvents({
        fromDate: dateTimeNow,
        minAccessLevel: accessLevel,
        direction: FilterDirection.ASCENDING,
        maxEntries: 1
    })).results[0] as Event | null

    // check whether the upcoming event is in progress
    const upcomingEventInProgress = upcomingEvent ? isEventInProgress(upcomingEvent) : false

    // get events in the future only if we're on the first page.
    const futureEvents = currentPage === 0 ? await filterEvents({
        fromDate: dateTimeNow,
        minAccessLevel: accessLevel,
        offset: 1,
        direction: FilterDirection.ASCENDING
    }) : undefined

    const currentOffset = currentPage * entriesPerPage
    const pastEvents = await filterEvents({
        toDate: dateTimeNow,
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
                <EventCard
                    event={upcomingEvent}
                    showQR={showQR}
                    inProgress={upcomingEventInProgress}
                    buttons={
                        upcomingEventInProgress && !showQR ? <BaseButton
                            text={langDict.events_attend}
                            href={`/api/events/attend?id=${upcomingEvent.id}`}
                            className="w-full sm:w-fit bg-on-primary text-primary before:bg-on-primary"
                        /> : undefined
                    }
                    className="p-6 bg-primary text-on-primary rounded-3xl"
                />
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