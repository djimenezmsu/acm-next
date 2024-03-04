'use client'

import { useRef } from "react"

export function UTCDateInput(
    {
        name,
        className
    }: {
        name: string,
        className?: string
    }
) {
    const hiddenRef = useRef(null as HTMLInputElement | null)

    return (
        <>
            <input type='text' name={name} ref={hiddenRef} hidden/>
            <input type='date' className={className} onChange={(event) => {
                if (hiddenRef.current) hiddenRef.current.value = new Date(event.target.value).toISOString()
            }}/>
        </>
    )
}