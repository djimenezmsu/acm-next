import { ImageInput } from "@/components/input/image-input";
import { InputSection } from "@/components/input/input-section";
import { MarkdownInput } from "@/components/input/markdown-input";
import { TextInputElement } from "@/components/input/text-input";
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
import fs, { writeFile } from 'fs'
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
        const imageInput = formData.get("imageInput") as File | null

        //Don't create announcement if non nullable are null
        if (title == null || body == null || postDate == "" || postDate == null)
            return

        //Store file on server
        if (imageInput != null) {
            const content = await imageInput.arrayBuffer()
                .then(response => new Int8Array(response))
            writeFile(`./public/media_images/${imageInput.name}`, content, (err) => {
                if (err != null)
                    console.log(err)
            })
        }

        await insertNews(
            title.toString(),
            subject == null ? null : subject.toString(),
            body.toString(),
            new Date(postDate.toString()),
            (imageInput != null) ? imageInput.name : ""
        )

        redirect("/news")
    }
    return (
        <form action={createAnnouncment} className="w-full flex flex-col gap-5">
            <PageHeader text="New Post"
                actions={
                    <section className="flex flex-col md:flex-row gap-5">
                        <section className="hidden md:block">
                        <FilledButton text={langDict.cancel_post} icon="close" href="./"/>
                        </section>
                        <FilledButton text={langDict.create_post} icon="add" />
                    </section>
                }
            />
            <Divider />
            <section className="w-full flex flex-col lg:flex-row gap-5 justify-between items-start">
                <ol className="w-full flex-1 flex flex-col gap-5 text-on-surface">
                    <li className="w-full flex flex-col gap-2 text-on-surface">
                        <InputSection title={langDict.news_title}>
                            <TextInputElement name="title" placeholder={langDict.news_title_placeholder} required />
                        </InputSection>
                    </li>
                    <li className="w-full flex flex-col gap-2 text-on-surface">
                        <InputSection title={langDict.news_date}>
                            <UTCDateInput name="date" required />
                        </InputSection>
                    </li>
                    <li className="w-full flex flex-col gap-2 text-on-surface">
                        <InputSection title={langDict.news_subject}>
                            <TextInputElement name="subject" placeholder={langDict.news_subject_placeholder} required />
                        </InputSection>
                    </li>
                </ol>
                <section className="w-fit m-auto">
                    <InputSection title={langDict.news_image}>
                        <ImageInput name="imageInput" />
                    </InputSection>
                </section>
            </section>
            <MarkdownInput title={langDict.news_body} name="body" />
        </form>
    )
}