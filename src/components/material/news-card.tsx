import { News } from "@/data/types";
import { FilledButton } from "./filled-button";

export function NewsCard(
    {news}: {news:News}
){
    return (
        <section className="lg:w-100% bg-surface-container p-4 rounded-2xl flex flex-col gap-5 h-fit">
            <p className="text-2xl">{news.title}</p>
            <p className="text-s text-wrap">{news.postDate.toLocaleDateString()}</p>
            <p className="break-words">{news.subject}</p>
            <FilledButton text="View More" href={"/news/:" + news.id}></FilledButton>
        </section>
    )
}