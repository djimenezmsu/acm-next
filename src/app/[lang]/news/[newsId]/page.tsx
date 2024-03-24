import { getNews } from "@/data/webData"
import { Locale, getDictionary } from "@/localization"
import Markdown from "react-markdown"
import Image from "@/components/image"
import { Divider } from "@/components/material/divider"
import { DateFormatter } from "@/components/formatters/date-formatter"
import { DateFormatterMode } from "@/components/formatters/types"
import { PageHeader } from "@/components/page-header"
import { FilledButton } from "@/components/material/filled-button"
import { getActiveSession } from "@/lib/oauth"
import { AccessLevel } from "@/data/types"
import { cookies } from "next/headers"
import { createNewsMinAccessLevel } from "../../events/page"
import { BaseButton } from "@/components/material/base-button"

export default async function Announcement(
    {
        params
    }: {
        params: {
            lang: Locale,
            newsId: number
        }
    }
) {
    const langDict = await getDictionary(params.lang)
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    const news = await getNews(params.newsId)
    if (news == null)
        return (
            <PageHeader text={langDict.news_id_not_found}/>
        )

    return (
        <article className="w-full flex flex-col gap-5 text-wrap break-words">
            <PageHeader text={news.title}></PageHeader>
            <h2 className="text-on-surface-variant">{news.subject}</h2>
            <section className="w-full flex flex-col md:flex-row justify-between items-center gap-5">
                <DateFormatter date={news.postDate} mode={DateFormatterMode.NARROW}/>
                {
                accessLevel >= createNewsMinAccessLevel ?
                <section className="flex gap-5">
                <FilledButton text="Edit" icon="edit"></FilledButton>
                <BaseButton text="Delete" icon="delete" className="bg-error text-on-error before:bg-on-error"></BaseButton>
                </section>
                :
                undefined
                }
            </section>
            <Divider/>
            <Markdown className="text-on-surface prose prose-xl max-w-none break-words">
                {news.body}
            </Markdown>
        </article>
    )
}