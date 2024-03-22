import { createEventMinAccessLevel } from "@/app/[lang]/events/page";
import { deleteEvent, getEvent } from "@/data/webData";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function DELETE(
    request: NextRequest
) {
    const params = request.nextUrl.searchParams

    // get event
    const eventId = Number(params.get("id"))
    const event = !isNaN(eventId) ? await getEvent(eventId) : null
    if (event === null) return new Response(JSON.stringify({ message: `No event with provided ID exists.` }), { status: 400 })

    // verify session
    const session = await getActiveSession(cookies())
    if (session === null || createEventMinAccessLevel > session.user.accessLevel) return new Response(JSON.stringify({ message: `Unauthorized` }), { status: 401 })

    // delete the event
    await deleteEvent(eventId)

    // redirect to the event's page
    return new Response(null, { status: 200 })
}