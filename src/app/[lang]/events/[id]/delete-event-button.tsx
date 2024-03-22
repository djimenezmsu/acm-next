'use client'

import { BaseButton } from "@/components/material/base-button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteEventButton(
    {
        eventId,
        text,
        redirectToHref = "./events"
    }: {
        eventId: number
        text: string
        redirectToHref?: string
    }
) {
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    function onDelete() {
        // debounce
        if (deleting) return
        setDeleting(true)

        // perform the API request
        fetch(`/api/events?id=${eventId}`, {
            method: "DELETE"
        }).then(response => response.status)
        .then(statusCode => {
            // redirect if the request was a success
            if (statusCode === 200) {
                router.push(redirectToHref)
            }
            setDeleting(false)
        })

    }

    return <BaseButton
        icon="delete"
        text={text}
        onClick={onDelete}
        className="w-full sm:w-fit bg-error text-on-error before:bg-on-error"
        disabled={deleting}
    />
}