import { AccessLevel, FilterDirection, Semester } from "@/data/types"
import { filterEvents } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import Link from "next/link"

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
    const upcomingEvent = futureEvents.shift()

    return (
        <article className="flex flex-col gap-5 w-full">
            <h1 className="text-on-surface md:text-5xl text-4xl font-bold w-full">{langDict.events_title}</h1>
            {upcomingEvent ? (
                <Link href={`/events/${upcomingEvent.id}`} className="flex gap-5 p-5">
                    
                </Link>
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