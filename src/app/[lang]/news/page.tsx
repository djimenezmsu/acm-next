import { getNewsfeed } from "@/data/webData";
import { AccessLevel, News } from "@/data/types"
import { NewsCard } from "@/components/news-card";
import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";
import { Locale, getDictionary } from "@/localization";
import { PageHeader } from "@/components/page-header";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";

export default async function Newsfeed(
    {
        lang
    }: {
        lang: Locale
    }
) {
    let data: News[] = []
    await getNewsfeed(50, 1)
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
        sections[2 * (maxYear - announcement.postDate.getFullYear()) + (announcement.postDate.getMonth() > 5 ? 0 : 1)].push(announcement)
    })

    // get the language dictionary
    const langDict = await getDictionary(lang)
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER
            

    return (
        <article className="w-full flex flex-col gap-5">
            <PageHeader
                text={langDict.nav_news}
                actions={(accessLevel > AccessLevel.NON_MEMBER)? <FilledButton text={langDict.news_new_post} href="/news/create" /> : <></>}
            />
            <Divider />
            {
                sections.map(section => {
                    if (section.length < 1)
                        return undefined
                    
                    const sectionIndex = sections.indexOf(section)
                    return (
                        <section className="w-full flex flex-col gap-5 text-on-surface" key={sectionIndex}>
                            <h1 className="text-on-surface font-semibold text-3xl ">{(sectionIndex % 2 == 0 ? "Fall " : "Spring ") + Math.ceil(maxYear - sectionIndex / 2)}</h1>
                            <ol className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 text-on-surface">
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
