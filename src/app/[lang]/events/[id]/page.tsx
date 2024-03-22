import { EventCard } from "@/components/events/event-card"
import { AccessLevel, User } from "@/data/types"
import { filterEventsAttendance, getEvent, getUser } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createEventMinAccessLevel, showQRCodeMinAccessLevel } from "../page"
import { isEventInProgress } from "@/lib/utils"
import { BaseButton } from "@/components/material/base-button"
import { FilledButton } from "@/components/material/filled-button"
import { Divider } from "@/components/material/divider"
import Image from "@/components/image"
import { IconButton } from "@/components/material/icon-button"
import { PageSelector } from "@/components/page-selector"
import { DeleteEventButton } from "./delete-event-button"

const entriesPerPage = 20

export default async function EventsPage(
    {
        params,
        searchParams
    }: {
        params: {
            lang: Locale,
            id: string
        }
        searchParams: {
            page: string
        }
    }
) {
    // get the language dictionary
    const lang = params.lang
    const langDict = await getDictionary(lang)

    // get the event
    const eventId = Number(params.id)
    const event = !isNaN(eventId) ? await getEvent(eventId) : null
    if (!event) return redirect(`/${lang}/events`) // if the event doesn't exist, simply redirect to the events page.

    // get the active session
    const session = await getActiveSession(cookies())
    const accessLevel = session !== null ? session.user.accessLevel : AccessLevel.NON_MEMBER

    // ensure that the user is authorized to view this event
    if (event.accessLevel > accessLevel) return redirect(`/${lang}/events`)

    // parse search params
    const currentPage = Math.max(Number.parseInt(searchParams.page) || 0, 0) // parse the page search parameter, ensuring that it is >= 1
    const currentOffset = currentPage * entriesPerPage

    // get event attendance
    const attendanceResult = await filterEventsAttendance({
        eventIds: [eventId],
        offset: currentOffset,
        maxEntries: entriesPerPage
    })
    const attendanceUsers: User[] = []
    for (const attendance of attendanceResult.results) {
        const user = await getUser(attendance.userEmail)
        if (user) {
            attendanceUsers.push(user)
        }
    }

    // event variables
    const showQRCode = accessLevel >= showQRCodeMinAccessLevel
    const canCreateEvents = accessLevel >= createEventMinAccessLevel
    const eventInProgress = isEventInProgress(event)

    return (
        <article className="w-full flex flex-col gap-5">
            <EventCard
                event={event}
                showQR={showQRCode}
                inProgress={eventInProgress}
                buttons={
                    <>
                        {eventInProgress && !showQRCode ? <FilledButton
                            text={langDict.events_attend}
                            href={`/api/events/attend?id=${event.id}`}
                            className="w-full sm:w-fit"
                        /> : undefined}
                        {canCreateEvents ? <>
                            <FilledButton
                                icon="edit"
                                text={langDict.event_edit}
                                href={`./${eventId}/edit`}
                                className="w-full sm:w-fit"
                            />
                            <DeleteEventButton
                                eventId={eventId}
                                text={langDict.event_delete}
                            />
                        </> : undefined}
                    </>
                }
                className="p-6 bg-surface-container rounded-3xl"
            />
            {/* Only show attendance to officers and higher */}
            {canCreateEvents ? <>
                <Divider />
                {currentPage === 0 && 0 >= attendanceResult.totalCount ? <h3 className="text-center w-full text-3xl font-bold">{langDict.event_no_attendance}</h3>
                    : <section>
                        <h3 className="text-2xl font-bold mb-2">{langDict.event_attendance}</h3>
                        <ul className="flex gap-3 flex-col w-full">
                            {attendanceUsers.map(user => <AttendanceListItem
                                key={user.email}
                                user={user}
                            />)}
                            <li><PageSelector
                                currentOffset={currentOffset}
                                totalCount={attendanceResult.totalCount}
                                pageSize={entriesPerPage}
                                href=''
                            /></li>
                        </ul>
                    </section>
                }
            </> : undefined}




        </article>
    )

}

function AttendanceListItem(
    {
        user
    }: {
        user: User
    }
) {
    return (
        <li className="w-full bg-surface-container-low rounded-3xl px-4 py-2 flex gap-5 items-center">
            <figure className="w-9 h-9">
                <Image
                    height={36}
                    width={36}
                    src={user.picture}
                    alt={user.givenName}
                    className="rounded-full object-cover"
                />
            </figure>
            <section className="flex flex-col">
                <h4 className="text-xl font-semibold">{user.givenName} {user.familyName}</h4>
                <h5 className="text-base text-on-surface-variant">{user.email}</h5>
            </section>
            <section className="flex-1 flex justify-end">
                <IconButton icon="delete" />
            </section>
        </li>
    )
}