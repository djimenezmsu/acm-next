
'use client'

import { dateToDateInputValue } from "@/lib/utils"
import { useRef, useState } from "react"

export function UTCDateInput(
    {
        name,
        required = false,
        value
    }: {
        name: string
        required?: boolean
        value?: Date
    }
) {
    const [formValue, setFormValue] = useState(value as Date | undefined)
    const hiddenRef = useRef(null as HTMLInputElement | null)
    const minDate = value === undefined ? new Date() : value // the minimum date that can be selected
    minDate.setHours(0, 0, 0, 0)

    return (
        <>
            <input type='text' name={name} ref={hiddenRef} value={formValue ? formValue.toISOString() : undefined} hidden />
            <input
                type='datetime-local'
                className="text-lg text-on-surface px-5 py-2 bg-surface-container rounded-full"
                value={formValue ? dateToDateInputValue(formValue) : undefined}
                onChange={(event) => {
                    const newVal = new Date(event.target.value)
                    setFormValue(newVal)
                }}
                min={dateToDateInputValue(minDate)}
                required={required}
            />
        </>
    )
}