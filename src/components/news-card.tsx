import { News } from "@/data/types";
import { FilledButton } from "./material/filled-button";
import { Locale, getDictionary } from "@/localization";

export async function NewsCard(
    {news, lang}: {news:News, lang: Locale},
){
    const locale = lang
    const langDict = await getDictionary(locale)
    return (
        <li className="lg:w-100% bg-surface-container p-4 rounded-2xl flex flex-col gap-5 h-fit text-wrap break-all">
            <p className="text-2xl">{news.title}</p>
            <p className="text-s">{news.postDate.toLocaleDateString()}</p>
            <p>{news.subject}</p>
            <FilledButton text={langDict.view_more} href={`/news/:${news.id}`}/>
        </li>
    )
}