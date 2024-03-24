'use server'

import { AccessLevel } from "@/data/types"
import { getActiveSession } from "@/lib/oauth"
import { cookies } from "next/headers"
import { createEventMinAccessLevel } from "../[lang]/events/page"
import { redirect } from "next/navigation"
import { getEvent, getEventType, updateEvent } from "@/data/webData"
import { EventActionState } from "./create-event"

export async function editEvent(prevState: EventActionState, formData: FormData) {

    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (createEventMinAccessLevel > accessLevel) return {
        error: "Unauthorized"
    } as EventActionState

    // get event
    const eventId = Number(formData.get("id"))
    const event = !isNaN(eventId) ? await getEvent(eventId) : null
    if (event === null) return {
        error: "Provided event ID is invalid."
    } as EventActionState

    // get the formdata
    const formFields = {
        title: formData.get('title'),
        location: formData.get('location'),
        startDate: formData.get('start-date'),
        endDate: formData.get('end-date'),
        type: formData.get('type'),
        accessLevel: formData.get('access-level')
    }

    // try to parse the event type
    const eventTypeValue = formFields.type ? Number.parseInt(formFields.type.toString()) : null
    const eventType = eventTypeValue && !isNaN(eventTypeValue) ? await getEventType(eventTypeValue) : null

    // try to insert the new event into the database
    let redirectTo = ''
    try {
        await updateEvent({
            id: eventId,
            title: formFields.title ? formFields.title.slice(0, 128).toString() : undefined,
            location: formFields.location ? formFields.location.slice(0, 52).toString() : undefined,
            startDate: formFields.startDate ? new Date(formFields.startDate.toString()) : undefined,
            endDate: formFields.endDate ? new Date(formFields.endDate.toString()) : undefined,
            type: eventType,
            accessLevel: formFields.accessLevel ? Number.parseInt(formFields.accessLevel.toString()) : undefined
        })
        redirectTo = `./`
    } catch( error: any ) {
        return {
            error: error?.message || 'Error when creating event.'
        } as EventActionState
    }

    // redirect if allowed
    redirect(redirectTo)
}