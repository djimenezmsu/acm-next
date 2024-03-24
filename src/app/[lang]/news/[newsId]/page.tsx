import { getNews } from "@/data/webData"
import { Locale, getDictionary } from "@/localization"
import Markdown from "react-markdown"
import Image from "@/components/image"
import { Divider } from "@/components/material/divider"
import { DateFormatter } from "@/components/formatters/date-formatter"
import { DateFormatterMode } from "@/components/formatters/types"
import { PageHeader } from "@/components/page-header"

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
    const news = await getNews(params.newsId)
    if (news == null)
        return (
            <>
                {langDict.news_id_not_found}
            </>
        )

    return (
        <article className="w-full flex flex-col gap-5">
            <PageHeader text={news.title}></PageHeader>
            <section>
                
            </section>
            <section className="w-full flex flex-col lg:flex-row gap-5 justify-between items-end">
                <ol className="w-full flex-1 flex flex-col gap-5 text-on-surface">
                    <li className="w-full flex flex-col gap-2 text-on-surface">
                    </li>
                    <li className="w-full flex flex-col gap-2 text-on-surface">
                        <DateFormatter date={news.postDate} mode={DateFormatterMode.NARROW}/>
                    </li>
                    <li className="w-full flex flex-col gap-2 text-on-surface">
                        <h2>{news.subject}</h2>
                    </li>
                </ol>
                <section className="w-fit m-auto">
                    <label className="p-2 w-80 h-80 rounded-2xl bg-surface-container hover:cursor-pointer flex flex-col gap-3 items-center justify-center hover:bg-surface-container-high transition-colors">
                        {
                            <img className={`rounded-xl object-cover w-full h-full`} src={`/media_images/${news.imageURL}`} ></img>
                        }
                    </label>
                </section>
            </section>
            <Divider/>
            <Markdown className="text-on-surface prose prose-xl max-w-none break-words">
                {news.body}
            </Markdown>
        </article>
    )
}