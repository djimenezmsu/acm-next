import { News } from "@/data/types";
import { FilledButton } from "./material/filled-button";
import { DateFormatter } from "./formatters/date-formatter";
import { DateFormatterMode } from "./formatters/types";

export async function NewsCard(
    {news, buttonText}: {news:News, buttonText: string},
){
    return (
        <li className="lg:w-100% bg-surface-container p-4 rounded-2xl flex flex-col gap-5 h-fit text-wrap">
            <h3 className="text-2xl">{news.title}</h3>
            <DateFormatter date={news.postDate} mode={DateFormatterMode.NARROW}/>
            <h4>{news.subject}</h4>
            <FilledButton text={buttonText} href={`/news/:${news.id}`}/>
        </li>
    )
}