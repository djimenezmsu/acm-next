export function InputSection(
    {
        title,
        children
    }: {
        title: string
        children?: React.ReactNode
    }
) {
    return (
        <section className="flex flex-col gap-3 w-full">
            <h2 className="text-2xl font-semibold">{title}</h2>
            {children}
        </section>
    )
}