import { Divider } from "@/components/material/divider";
import { PageHeader } from "@/components/page-header";
import { getNews } from "@/data/webData";
import { getDictionary, Locale } from "@/localization"

export default async function Announcement(
    {
        params
    }:
        {
            params: {
                lang: Locale,
                newsId: number
            }
        }
) {
    let langDict = getDictionary(params.lang);
    let news = await getNews(params.newsId)

    if (news == null)
        return <>News Id Not Found</>
    return (
        <>
            <PageHeader text={news.title}/>
            <Divider />
            
        </>
    )
}