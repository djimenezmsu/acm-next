import { getNewsfeed } from "@/data/webData";
import { News } from "@/data/types"
import { NewsCard } from "@/components/news-card";
import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";
import { Locale, getDictionary } from "@/localization";

export default async function Newsfeed(
    {
        params
      }: {
        params: {
          lang: Locale
        }
      }
) {
    const locale = params.lang
    const langDict = await getDictionary(locale)

    let data: News[] = []
    const newsFeed = await getNewsfeed(new Date(2024, 1, 1), 10, 0)
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

    return (
        <article className="w-full max-w-6xl flex flex-col gap-5 mt-20  text-on-surface">
            <section className="w-full flex flex-row justify-between align-middle">
                <h1 className="text-on-surface font-bold text-4xl ">{langDict.nav_news}</h1>
                <FilledButton text={langDict.new_post} href="/news/create" />
            </section>
            <Divider />
            {
                sections.map(section => {
                    if (section.length < 1)
                        return <></>
                    return (
                        <section className="w-full max-w-6xl flex flex-col gap-5 text-on-surface">
                            <h1 className="text-on-surface font-semibold text-3xl ">{(sections.indexOf(section) % 2 == 0 ? `${langDict.Fall} ` : `${langDict.Spring} `) + Math.ceil(maxYear - sections.indexOf(section) / 2)}</h1>
                            <ol className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 text-on-surface">
                                {
                                    section.map(announcement => {
                                        return <NewsCard news={announcement} lang={params.lang}/>
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
