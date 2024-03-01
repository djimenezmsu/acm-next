import { getNewsfeed } from "@/data/webData";
import { News } from "@/data/types"
import { NewsCard } from "@/components/news-card";
import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";
import { Locale, getDictionary } from "@/localization";

export default async function Newsfeed(
    {
        lang
    }: {
        lang: Locale
    }
) {
    let data: News[] = []
    const newsFeed = await getNewsfeed(new Date(2023, 1, 1), 10, 0)
        .then(result => data = result)
        .catch(error => {
            return (
                <div>{error}</div>
            )
        })

    let maxYear = 0
    let minYear = 0

    data.map(announcement => {
        maxYear = Math.max(announcement.postDate.getFullYear(), maxYear)
        minYear = Math.min(announcement.postDate.getFullYear(), maxYear)
    })

    //Sections is a doubled-up array
    //index 0 is maxYear Fall and index 1 is maxYear Spring and so on
    let sections: News[][] = []
    for (let i = 0; i < 2 * (maxYear - minYear + 1); i++) {
        sections.push([])
    }

    //Add each news to its appropriate section
    data.forEach(announcement => {
        sections[2 * (maxYear - announcement.postDate.getFullYear()) + (announcement.postDate.getMonth() > 6 ? 0 : 1)].push(announcement)
    })

    // get the language dictionary
    const langDict = await getDictionary(lang)

    return (
        <article className="w-full max-w-6xl flex flex-col gap-5 mt-20 text-on-surface">
            <section className="w-full flex items-end">
                <h1 className="text-on-surface md:text-5xl text-4xl font-bold flex-1">{langDict.nav_news}</h1>
                <FilledButton text={langDict.new_post} href="/news/create" />
            </section>
            <Divider />
            {
                sections.map(section => {
                    if (section.length < 1)
                        return undefined
                    
                    const sectionIndex = sections.indexOf(section)
                    return (
                        <section className="w-full max-w-6xl flex flex-col gap-5 text-on-surface" key={sectionIndex}>
                            <h1 className="text-on-surface font-semibold text-3xl ">{(sectionIndex % 2 == 0 ? "Fall " : "Spring ") + Math.ceil(maxYear - sectionIndex / 2)}</h1>
                            <ol className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 text-on-surface">
                                {
                                    section.map(announcement => {
                                        return <NewsCard news={announcement} buttonText={langDict.view_more} key={announcement.id} />
                                    })
                                }
                            </ol>
                        </section>
                    )
                })
            }
        </article>
    )
}
