import { AccessLevel } from "@/data/types";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SelectInputOption } from "@/components/input/select-input";
import { getAllEventTypes, getEvent } from "@/data/webData";
import { createEventMinAccessLevel } from "../../page";
import { EventForm } from "../../form";
import { Locale, getDictionary } from "@/localization";
import { EditEventForm } from "./edit-event-form";

export default async function CreateEventPage(
    {
        params,
    }: {
        params: {
            lang: Locale
            id: string
        }
    }
) {
    // get session & access level
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (createEventMinAccessLevel > accessLevel) return redirect('./')

    const lang = params.lang
    
    // get the event
    const eventId = Number(params.id)
    const event = !isNaN(eventId) ? await getEvent(eventId) : null
    if (!event) return redirect(`/${lang}/events`) // if the event doesn't exist, simply redirect to the events page.

    // get event types
    const eventTypeOptions: SelectInputOption[] = []
    const types = await getAllEventTypes()

    for (const event of types) {
        eventTypeOptions.push({
            name: event.name,
            value: String(event.id)
        })
    }

    return (
        <article className="w-full flex flex-col gap-5">
            <EditEventForm
                values={{
                    id: String(event.id),
                    title: event.title,
                    location: event.location,
                    startDate: event.startDate.toISOString(),
                    endDate: event.endDate.toISOString(),
                    type: event.type ? event.type.id as number : undefined,
                    accessLevel: event.accessLevel == AccessLevel.OFFICER ? 2 : 1
                }}
                eventTypeOptions={eventTypeOptions}
            />
        </article>
    )
}
