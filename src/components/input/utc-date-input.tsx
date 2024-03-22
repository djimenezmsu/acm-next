
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
    const minDate = new Date() // the minimum date that can be selected
    minDate.setHours(0, 0, 0, 0)

    return (
        <>
            <input type='text' name={name} ref={hiddenRef} hidden />
            <input
                type='datetime-local'
                className="text-lg text-on-surface px-5 py-2 bg-surface-container rounded-full"
                onChange={(event) => {
                    try {
                        if (hiddenRef.current) hiddenRef.current.value = new Date(event.target.value).toISOString()
                    } catch {}
                }}
                min={dateToDateInputValue(minDate)}
                required={required}
            />
        </>
    )
}