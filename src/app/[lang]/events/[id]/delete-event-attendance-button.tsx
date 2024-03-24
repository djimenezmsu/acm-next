'use client'

import { BaseButton } from "@/components/material/base-button"
import { IconButton } from "@/components/material/icon-button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteEventAttendanceButton(
    {
        eventId,
        email
    }: {
        eventId: number
        email: string
    }
) {
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    function onDelete() {
        // debounce
        if (deleting) return
        setDeleting(true)

        // perform the API request
        fetch(`/api/events/attend?id=${eventId}&userEmail=${email}`, {
            method: "DELETE"
        }).then(response => response.status)
        .then(statusCode => {
            // redirect if the request was a success
            if (statusCode === 200) {
                router.refresh()
            }
            setDeleting(false)
        })

    }

    return <IconButton
        icon="delete"
        onClick={onDelete}
    />
}