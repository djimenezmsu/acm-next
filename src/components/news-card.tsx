import { News } from "@/data/types";
import { FilledButton } from "./material/filled-button";

export function NewsCard(
    {news}: {news:News}
){
    return (
        <section className="lg:w-100% bg-surface-container p-4 rounded-2xl flex flex-col gap-5 h-fit text-wrap break-all">
            <p className="text-2xl">{news.title}</p>
            <p className="text-s">{news.postDate.toLocaleDateString()}</p>
            <p>{news.subject}</p>
            <FilledButton text="View More" href={`/news/:${news.id}`}/>
        </section>
    )
}