import { Event } from "@/data/types"
import { DateFormatter } from "../formatters/date-formatter"
import { EventField } from "./event-field"
import { DateRangeFormatter } from "../formatters/date-range-formatter"

export function EventFields(
    {
        event,
        className = '',
        fieldClassName
    }: {
        event: Event
        className?: string
        fieldClassName?: string
    }
) {
    return (
        <ul className={`flex flex-col gap-3 h-fit ${className}`}>
            {/* Start Date */}
            <EventField text={<DateFormatter date={event.startDate} />} icon='calendar_month' className={fieldClassName} />

            {/* Location */}
            <EventField text={event.location} icon='explore' className={fieldClassName} />

            {/* Duration */}
            <EventField text={<DateRangeFormatter dateFrom={event.startDate} dateTo={event.endDate} />} icon='schedule' className={fieldClassName} />

            {/* Type */}
            {event.type ? <EventField text={event.type.name} icon='book' className={fieldClassName} /> : undefined}
        </ul>
    )
}