'use client'

import { useState } from "react"

export interface SelectInputOption {
    value: string
    name: string
}

export function SelectInput(
    {
        name,
        options,
        required = false,
        value
    }: {
        name: string
        options: SelectInputOption[]
        required?: boolean
        value?: number
    }
) {
    const [formValue, setValue] = useState(String(value) || "0")

    return (
        <select
            name={name}
            className="text-lg text-on-surface px-5 py-2 bg-surface-container rounded-full"
            required={required}
            value={formValue}
            onChange={event => setValue(event.target.value)}
        >
            {options.map(option => (
                <option value={option.value} key={option.value}>{option.name}</option>
            ))}
        </select>
    )
}