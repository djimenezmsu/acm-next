import { IconButton } from "./material/icon-button"
import { Icon } from "./material/icon"
import Link from "next/link"

export function PageSelector(
    {
        currentOffset = 0,
        totalCount = 0,
        surroundingPageCount = 1,
        pageSize = 50,
        href = ''
    }: {
        currentOffset?: number
        totalCount?: number
        surroundingPageCount?: number
        pageSize?: number
        href?: string
    }
) {

    const currentPage = Math.floor((isNaN(currentOffset) ? 0 : currentOffset) / pageSize)
    const totalPages = Math.ceil(totalCount / pageSize)

    const elements: React.ReactNode[] = []
    for (let i = Math.max(0, currentPage - surroundingPageCount); i < Math.min(totalPages, currentPage + surroundingPageCount + 1); i++) {
        elements.push(
            <PageSelectorItem
                text={(i + 1).toString()}
                active={i === currentPage}
                href={`${href}?page=${i}`}
            />
        )
    }

    return (
        <ul className="w-full flex items-center justify-center gap-3 mt-5">
            {currentPage > 0 ? <IconButton icon='arrow_back' href={`${href}?page=${currentPage - 1}`} /> : undefined}
            {currentPage > surroundingPageCount ? <>
                <PageSelectorItem text='1' href={`${href}?page=0`} />
                <Icon icon='more_horiz' />
            </> : undefined}
            {elements}
            {/* Jump to Last Page */}
            {(totalPages - (surroundingPageCount + 1)) > currentPage ? <>
                <Icon icon='more_horiz' />
                <PageSelectorItem text={totalPages.toString()} href={`${href}?page=${totalPages - 1}`} />
            </> : undefined}
            {totalPages > (currentPage + 1) && totalPages > 1 ? <IconButton icon='arrow_forward' href={`${href}?page=${currentPage + 1}`} /> : undefined}
        </ul>
    )

}

function PageSelectorItem(
    {
        text,
        href,
        active
    }: {
        text: string,
        href: string,
        active?: boolean
    }
) {
    return (
        <Link href={href} className={`h-10 min-w-10 px-4 flex items-center justify-center text-lg rounded-full transition-colors ${active ? 'text-on-secondary-container bg-secondary-container' : 'text-on-background hover:bg-surface-container-lowest'}`} >{text}</Link>
    )
}