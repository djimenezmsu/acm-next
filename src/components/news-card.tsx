import { News } from "@/data/types";
import { FilledButton } from "./material/filled-button";
import { Locale } from "@/localization";

export async function NewsCard(
    {news, buttonText}: {news:News, buttonText: string},
){
    return (
        <li className="lg:w-100% bg-surface-container p-4 rounded-2xl flex flex-col gap-5 h-fit text-wrap break-all">
            <p className="text-2xl">{news.title}</p>
            <p className="text-s">{news.postDate.toLocaleDateString()}</p>
            <p>{news.subject}</p>
            <FilledButton text={buttonText} href={`/news/:${news.id}`}/>
        </li>
    )
}