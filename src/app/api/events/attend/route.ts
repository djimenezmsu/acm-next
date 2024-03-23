import { createEventMinAccessLevel } from "@/app/[lang]/events/page";
import { attendEvent, deleteEventAttendance, getEvent, hasUserAttendedEvent } from "@/data/webData";
import { getActiveSession } from "@/lib/oauth";
import { isEventInProgress } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest
) {
    const params = request.nextUrl.searchParams

    // get event
    const eventId = Number(params.get("id"))
    const event = !isNaN(eventId) ? await getEvent(eventId) : null
    if (event === null) return redirect("/events")

    // verify that the event can be attended
    if (!isEventInProgress(event)) return redirect("/events")

    // verify session
    const session = await getActiveSession(cookies())
    if (session === null) return redirect(`/api/oauth?refer=/api/events/attend?id=${eventId}`)

    // verify that the user hasn't already attended the event
    const userEmail = session.user.email
    if (await hasUserAttendedEvent(eventId, userEmail)) return redirect(`/events/${eventId}`)

    // attend the event
    await attendEvent(
        eventId,
        userEmail
    )

    // redirect to the event's page
    return redirect(`/events/${eventId}`)
}

export async function DELETE(
    request: NextRequest
) {

    const params = request.nextUrl.searchParams

    // verify session
    const session = await getActiveSession(cookies())
    if (session === null || createEventMinAccessLevel > session.user.accessLevel) return new Response(JSON.stringify({ message: `Unauthorized` }), { status: 401 })

    // get event
    const rawEventId = Number(params.get("id"))
    const eventId = !isNaN(rawEventId) ? rawEventId : null
    if (eventId === null) return new Response(JSON.stringify({ message: `Invalid event ID.` }), { status: 400 })

    // get user
    const email = params.get("userEmail")
    if (email === null) return new Response(JSON.stringify({ message: `No email provided.` }), { status: 401 })

    // delete attendance
    try {
        await deleteEventAttendance(
            eventId,
            email
        )
    } catch (error) {
        return new Response(JSON.stringify({ message: `Error when deleting event attendance.` }), { status: 500 })
    }

    return new Response(null, { status: 200 })
}