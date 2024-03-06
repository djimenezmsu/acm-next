import { InputSection } from "@/components/input/input-section";
import { TextInputElement } from "@/components/input/text-input";
import { TextAreaInputElement } from "@/components/input/textarea-input";
import { UTCDateInput } from "@/components/input/utc-date-input";
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
        const imageInput = formData.get("imageInput")

        //Don't create announcement if non nullable are null
        if (title == null || body == null || postDate == null)
            return

        await insertNews(
            title.toString(), 
            subject == null ? null : subject.toString(),
            body.toString(), 
            new Date(postDate.toString()), 
            imageInput == null? null : imageInput.toString()
        )

        redirect("/news")
    }
    return (
        <form action={createAnnouncment} className="w-full flex flex-col gap-5">
            <PageHeader text="New Post" actions={<FilledButton text={langDict.create_post}/>} />
            <Divider />
            <ol className="w-full flex flex-col gap-5 text-on-surface">
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <InputSection title={langDict.news_title}>
                        <TextInputElement name="title" placeholder={langDict.news_title_placeholder} required></TextInputElement>
                    </InputSection>
                </li>
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <InputSection title={langDict.news_date}>
                        <UTCDateInput name="date" />
                    </InputSection>
                </li>
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <InputSection title={langDict.news_subject}>
                        <TextInputElement name="title" placeholder={langDict.news_subject_placeholder} required></TextInputElement>
                    </InputSection>
                </li>
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <InputSection title={langDict.news_body}>
                        <TextAreaInputElement name="body" placeholder={langDict.news_body_placeholder} required />
                    </InputSection>
                </li>
                <li className="w-full flex flex-col gap-2 text-on-surface">
                    <InputSection title={langDict.news_image}>
                        <label className="w-80 h-80 rounded-2xl bg-surface-container" htmlFor="imageInput"/>
                        <input name="imageInput" type="file"/>
                    </InputSection>
                </li>
            </ol>
        </form>
    )
}