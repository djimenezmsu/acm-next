import { Event } from "@/data/types"
import Link from "next/link"
import { EventFields } from "./event-fields"
import QRCode from "react-qr-code"

export function EventCard(
    {
        event,
        showQR = false,
        inProgress = false,
        className = "",
        buttons,
    }: {
        event: Event
        showQR?: boolean
        inProgress?: boolean
        className?: string,
        buttons?: React.ReactNode
    }
) {

    return (
        <section className={`flex sm:flex-row flex-col gap-5 items-center h-fit ${className}`}>
            <section className="flex-1 flex gap-3 h-full flex-col justify-center">
                <Link href={`./events/${event.id}`} className="text-4xl sm:text-left text-center font-bold text-inherit hover:text-primary-container transition-colors">{event.title}</Link>
                {inProgress && showQR ? <EventFields event={event} className="justify-start mt-2" fieldClassName="flex-row-reverse" /> : undefined }
                <section className="flex-1 flex flex-col gap-3 sm:flex-row justify-end sm:justify-start mt-2">{buttons}</section>
            </section>
            {inProgress && showQR ? (
                <QRCode className="w-full h-full max-w-56 max-h-56 p-3 bg-white rounded-3xl" value={`/api/events/attend?id=${event.id}`} />
            ) : (
                <EventFields event={event} className="sm:items-end items-center justify-center" />
            )}
        </section>
    )

}