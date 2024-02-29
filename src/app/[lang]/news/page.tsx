import { getNewsfeed } from "@/data/webData";
import { News } from "@/data/types"
import { NewsCard } from "@/components/news-card";
import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";

export default async function Newsfeed() {
    let data: News[] = []
    const newsFeed = await getNewsfeed(new Date(2024, 1, 1), 10, 0)
        .then(result => data = result)
        .catch(error => {
            return (
                <div>{error}</div>
            )
        })

    let maxYear = 0
    let yearList = new Set()

    data.map(announcement => {
        maxYear = Math.max(announcement.postDate.getFullYear(), maxYear)
        yearList.add(announcement.postDate.getFullYear())
    })

    let sections: News[][] = []
    for (let i = 0; i < yearList.size * 2; i++) {
        sections.push([])
    }
    data.forEach(announcement => {
        sections[2 * (maxYear-announcement.postDate.getFullYear()) + announcement.postDate.getMonth() > 6? 0 : 1].push(announcement)
    })

    console.log(sections)
    
    return (
        <article className="w-full max-w-6xl flex flex-col gap-5 mt-20  text-on-surface">
            <section className="w-full flex flex-row justify-between align-middle">
                <h1 className="text-on-surface font-bold text-4xl ">News</h1>
                <FilledButton text="New Post"/>
            </section>
            <Divider />
            {
                sections.map(section => {
                    return (
                        <section className="w-full max-w-6xl flex flex-col gap-5 text-on-surface">
                            <h1 className="text-on-surface font-bold text-4xl ">{sections.indexOf(section) % 2 == 0? "Fall": "Spring"}</h1>
                            <Divider/>
                            <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 text-on-surface">
                            {
                                section.map(announcement => {
                                    return <NewsCard news={announcement}/>
                                })
                            }
                            </section>
                        </section>
                    )
                })
            }
            
        </article>
    )
}
