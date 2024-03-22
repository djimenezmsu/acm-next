'use client'

import { useLocale } from "@/components/providers/language-dict-provider"
import { EventForm, EventFormValues } from "../form"
import { SelectInputOption } from "@/components/input/select-input"
import { createEvent } from "@/app/actions/create-event"

export function CreateEventForm(
    {
        eventTypeOptions
    }: {
        eventTypeOptions: SelectInputOption[]
    }
) {
    const langDict = useLocale()
    return <EventForm
        title={langDict.new_event_title}
        values={{}}
        actionText={langDict.new_event_create}
        action={createEvent}
        eventTypeOptions={eventTypeOptions}
    />
}