'use client'

import Markdown from "react-markdown"
import { useState } from "react"
import { useRef } from "react"
import { useLocale } from "../providers/language-dict-provider"
import { TextAreaInputElement } from "./textarea-input"
import { FilledButton } from "../material/filled-button"

export function MarkdownInput(
    {
        title,
        name
    }:
        {
            title: string,
            name: string
        }
) {
    const langDict = useLocale();
    const [showMarkdown, setShowMarkdown] = useState(false)
    const [markdownValue, setMarkdownValue] = useState("")
    return (
        <section className="flex flex-col gap-3 w-full">
            <section className="w-full flex gap-5 justify-between">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <FilledButton
                    text="Preview"
                    icon={showMarkdown ? "preview_off" : "preview"}
                    onClick={(event) => {
                        event.preventDefault()
                        setShowMarkdown(!showMarkdown)
                    }}
                />
            </section>
            {
                (showMarkdown) ?
                <div className="w-full bg-surface-container rounded-2xl px-5 py-2">
                    <Markdown className="text-on-surface prose prose-xl max-w-none break-words">
                        {markdownValue ? markdownValue : "No message found"}
                    </Markdown>
                </div>
                :
                <TextAreaInputElement name="" placeholder={langDict.news_body_placeholder} required onChange={(newValue) => setMarkdownValue(newValue)} value={markdownValue} />
            }
            <input name={name} type="hidden" value={markdownValue} />
        </section>
    )
}