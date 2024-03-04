import { AccessLevel } from "@/data/types"
import { filterEvents } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"

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

//     INSERT INTO events (title, location, start_date, end_date, type, access_level)
// VALUES ("Blue Rapid Turtle", "Violet Room", "2024-03-12", "2024-03-13", 1, 0);
// INSERT INTO events (title, location, start_date, end_date, type, access_level)
// VALUES ("Magenta Raging Fly", "Green Room", "2024-03-10", "2024-03-11", 1, 0);
// INSERT INTO events (title, location, start_date, end_date, type, access_level)
// VALUES ("Officer Meeting", "Red Room", "2024-03-08", "2024-03-09", 3, 2);
// INSERT INTO events (title, location, start_date, end_date, type, access_level)
// VALUES ("Hollow Venomous Bear", "Yellow Room", "2024-03-06", "2024-03-07", 1, 0);
// INSERT INTO events (title, location, start_date, end_date, type, access_level)
// VALUES ("Kind Quacky Doctor", "Pacific Room", "2024-03-04", "2024-03-05", 1, 0);
// INSERT INTO events (title, location, start_date, end_date, type, access_level)
// VALUES ("Orange Ill Ostrich", "Oceanview Room", "2024-03-02", "2024-03-03", 1, 0);
// INSERT INTO events (title, location, start_date, end_date, type, access_level)
// VALUES ("Toxic British Puppy", "Forest Room", "2024-02-29", "2024-03-01", 1, 0);
// INSERT INTO events (title, location, start_date, end_date, type, access_level)
// VALUES ("Ripped Green Tiger", "Safari Room", "2024-02-27", "2024-02-28", 1, 0);

    // get session & access level
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    // get past & future events
    const dateNow = new Date()
    const futureEvents = await filterEvents({fromDate: dateNow, minAccessLevel: accessLevel})
    const pastEvents = await filterEvents({toDate: dateNow, minAccessLevel: accessLevel})

    return (
        <article className="flex flex-col gap-5 w-full">
            <h1 className="text-on-surface md:text-5xl text-4xl font-bold w-full">{langDict.events_title}</h1>
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