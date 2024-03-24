'use server'

import { AccessLevel, EventType } from "@/data/types"
import { getActiveSession } from "@/lib/oauth"
import { cookies } from "next/headers"
import { createEventMinAccessLevel } from "../[lang]/events/page"
import { redirect } from "next/navigation"
import { getEventType, insertEvent } from "@/data/webData"

export interface EventActionState {
    error?: string
}

export async function createEvent(prevState: EventActionState, formData: FormData) {
    
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (createEventMinAccessLevel > accessLevel) return {
        error: "Unauthorized"
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

    // verify that required fields aren't missing
    if (!formFields.title || !formFields.location || !formFields.startDate || !formFields.endDate || !formFields.type || !formFields.accessLevel) return {
        error: 'Missing input fields.'
    } as EventActionState

    // try to parse the event type
    const eventTypeValue = Number.parseInt(formFields.type.toString())
    const eventType = !isNaN(eventTypeValue) ? await getEventType(eventTypeValue) : null
    if (!eventType) return {
        error: `Invalid event type [${formFields.type.toString()}}]`
    } as EventActionState

    // try to insert the new event into the database
    let redirectTo = ''
    try {
        const newEvent = await insertEvent({
            title: formFields.title.slice(0, 128).toString(),
            location: formFields.location.slice(0, 52).toString(),
            startDate: new Date(formFields.startDate.toString()),
            endDate: new Date(formFields.endDate.toString()),
            type: eventType,
            accessLevel: Number.parseInt(formFields.accessLevel.toString())
        })
        redirectTo = `./${newEvent.id}`
    } catch( error: any ) {
        return {
            error: error?.message || 'Error when creating event.'
        } as EventActionState
    }

    // redirect if allowed
    redirect(redirectTo)
}