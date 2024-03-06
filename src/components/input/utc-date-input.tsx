
'use client'

import { dateToDateInputValue } from "@/lib/utils"
import { useRef } from "react"

export function UTCDateInput(
    {
        name,
        required = false
    }: {
        name: string
        required?: boolean
    }
) {
    const hiddenRef = useRef(null as HTMLInputElement | null)

    return (
        <>
            <input type='text' name={name} ref={hiddenRef} hidden />
            <input
                type='datetime-local'
                className="text-lg text-on-surface px-5 py-2 bg-surface-container rounded-full"
                onChange={(event) => {
                    if (hiddenRef.current) hiddenRef.current.value = new Date(event.target.value).toISOString()
                }}
                min={dateToDateInputValue(new Date())}
                required={required}
            />
        </>
    )
}