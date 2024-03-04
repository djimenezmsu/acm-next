export function PageHeader(
    {
        text,
        subtitle,
        actions
    }: {
        text: string
        subtitle?: React.ReactNode
        actions?: React.ReactNode
    }
) {
    return (
        <section className="flex gap-5 items-end">
            <section className="flex flex-col gap-5 flex-1">
                <h1 className="text-on-surface md:text-5xl text-4xl font-bold">{text}</h1>
                {subtitle}
            </section>
            {actions}
        </section>
    )
}