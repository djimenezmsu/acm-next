'use client'

import { useState } from "react"

export function TextInputElement(
    {
        name,
        placeholder,
        required = false,
        maxLength,
        value
    }: {
        name: string,
        placeholder: string,
        required?: boolean,
        maxLength?: number
        value?: string
    }
) {
    const [formValue, setValue] = useState(value || '')

    return (
        <input
            type='text'
            className="text-lg text-primary font-bold placeholder:font-normal placeholder:text-on-surface-variant px-5 py-2 bg-surface-container rounded-full"
            name={name}
            value={formValue}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            onChange={(event) => setValue(event.target.value)}
        />
    )
}