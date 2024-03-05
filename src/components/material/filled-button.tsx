import { MouseEventHandler } from "react";
import { BaseButton } from "./base-button";

export function FilledButton(
    {
        text,
        icon,
        href,
        onClick,
        className = '',
        disabled
    }: {
        text: string,
        icon?: string,
        href?: string,
        onClick?: MouseEventHandler,
        className?: string,
        disabled?: boolean
    }
) {
    return (  
        <BaseButton
            text={text}
            icon={icon}
            href={href}
            onClick={onClick}
            className={`bg-primary text-on-primary before:bg-on-primary ${className}`}
            disabled={disabled}
        />
    )
}