import { Icon } from "../material/icon"

export function EventField(
    {
        text,
        icon,
        className = ''
    }: {
        text: React.ReactNode,
        icon: string,
        className?: string
    }
) {
    return (
        <li className={`flex items-center justify-end gap-3 ${className}`}>
            <h3 className="text-lgs">{text}</h3>
            <Icon icon={icon} />
        </li>
    )
}