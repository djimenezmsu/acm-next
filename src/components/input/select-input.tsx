export interface SelectInputOption {
    value: string
    name: string
}

export function SelectInput(
    {
        name,
        options,
        required = false
    }: {
        name: string
        options: SelectInputOption[]
        required?: boolean
    }
) {
    return (
        <select
            name={name}
            className="text-lg text-on-surface px-5 py-2 bg-surface-container rounded-full"
            required={required}
        >
            {options.map(option => (
                <option value={option.value} key={option.value}>{option.name}</option>
            ))}
        </select>
    )
}