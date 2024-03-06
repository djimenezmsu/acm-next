import { AccessLevel } from "@/data/types";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";
import { createEventMinAccessLevel } from "../page";
import { redirect } from "next/navigation";
import { CreateEventForm } from "./form";
import { SelectInputOption } from "@/components/input/select-input";
import { getAllEventTypes } from "@/data/webData";

export default async function CreateEventPage() {
    // get session & access level
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (createEventMinAccessLevel > accessLevel) return redirect('./')

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
            <CreateEventForm
            eventTypeOptions={eventTypeOptions}
            />
        </article>
    )
}
