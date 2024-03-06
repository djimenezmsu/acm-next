export function TextInputElement(
    {
        name,
        placeholder,
        required = false,
        maxLength,
    }: {
        name: string,
        placeholder: string,
        required?: boolean,
        maxLength?: number
    }
) {
    return (
        <input
            type='text'
            className="text-lg text-primary font-bold placeholder:font-normal placeholder:text-on-surface-variant px-5 py-2 bg-surface-container rounded-full"
            name={name}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
        />
    )
}