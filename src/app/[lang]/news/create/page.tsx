import { UTCDateInput } from "@/components/inputs/utc-date-input";
import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";
import { PageHeader } from "@/components/page-header";
import { AccessLevel } from "@/data/types";
import { insertNews } from "@/data/webData";
import { getActiveSession } from "@/lib/oauth";
import { Locale, getDictionary } from "@/localization";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Announcement(
    {
        lang
    }: {
        lang: Locale
    }
) {
    const langDict = await getDictionary(lang)

    async function createAnnouncment(formData: FormData) {
        'use server'
        const session = await getActiveSession(cookies())
        const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER
        if (accessLevel <= AccessLevel.NON_MEMBER)
            redirect("./")

        const title = formData.get('title')
        const postDate = formData.get("date")
        const subject = formData.get("subject")
        const body = formData.get("body")
        const imageUrl = formData.get("imageUrl")

        //Don't create announcement if non nullable are null
        if (title == null || body == null || postDate == null)
            return

        await insertNews(
            title.toString(), 
            subject == null ? null : subject.toString(),
            body.toString(), 
            new Date(postDate.toString()), 
            imageUrl == null? null : imageUrl.toString()
        )

        redirect("/news")
    }
    return (
        <form action={createAnnouncment} className="w-full max-w-6xl flex flex-col gap-5 mt-20 text-on-surface">
            <PageHeader text="New Post" actions={<FilledButton text={langDict.create_post}/>} />
            <Divider />
            <ol className="w-full flex flex-col gap-5 text-on-surface">
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <label>Title</label>
                    <input name="title" type="Text" className="rounded-2xl p-1 bg-surface-container" autoComplete="off" required />
                </li>
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <label>Post Date</label>
                    <UTCDateInput name="date" className="rounded-2xl p-1 bg-surface-container"></UTCDateInput>
                </li>
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <label>Subject</label>
                    <input name="subject" type="Text" className="rounded-2xl p-1 bg-surface-container" autoComplete="off" />
                </li>
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <label>Body</label>
                    <textarea name="body" className="rounded-2xl p-2 h-fit resize-none bg-surface-container" rows={10} required />
                </li>
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <p>Social Media Image</p>
                    <label className="w-80 h-80 rounded-2xl bg-surface-container" htmlFor="imageInput"></label>
                    <input name="imageUrl" type="file" hidden/>
                </li>
            </ol>
        </form>
    )
}