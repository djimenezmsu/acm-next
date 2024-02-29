import { getNewsfeed } from "@/data/webData";
import { News } from "@/data/types"
import { NewsCard } from "@/components/material/news-card";
import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";

export default async function News() {
    let data: News[] = []
    const newsFeed = await getNewsfeed(new Date(2024, 1, 1), 10, 0)
        .then(result => data = result)
        .catch(error => {
            return (
                <div>{error}</div>
            )
        })

    return (
        <article className="w-full max-w-6xl flex flex-col gap-5 mt-20  text-on-surface">
            <section className="w-full flex flex-row justify-between align-middle">
                <h1 className="text-on-surface font-bold text-4xl ">News</h1>
                <FilledButton text="New Post" className=""/>
            </section>
            <Divider />
            <section className="w-full max-w-6xl grid grid-cols-1  lg:grid-cols-3 gap-5 text-on-surface">
                {
                    data.map(announcement => {
                        return <NewsCard news={announcement}></NewsCard>
                    })
                }
            </section>
        </article>
    )
}
