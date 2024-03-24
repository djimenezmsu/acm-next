'use client'

import { useLocale } from "@/components/providers/language-dict-provider"
import { SelectInputOption } from "@/components/input/select-input"
import { EventForm, EventFormValues } from "../../form"
import { editEvent } from "@/app/actions/edit-event"

export function EditEventForm(
    {
        values,
        eventTypeOptions
    }: {
        values: EventFormValues
        eventTypeOptions: SelectInputOption[]
    }
) {
    const langDict = useLocale()
    return <EventForm
        title={langDict.edit_event_title.replace(":event_title", values.title || '')}
        values={values}
        actionText={langDict.edit_event_save}
        action={editEvent}
        eventTypeOptions={eventTypeOptions}
    />
}