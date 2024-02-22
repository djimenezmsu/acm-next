'use client'

import { LanguageDictionary } from "@/localization"
import { LanguageDictionaryProvider } from "./language-dict-provider"
import { ThemeProvider } from 'next-themes'

export function Providers(
    {
        dictionary,
        children
    }: {
        dictionary: LanguageDictionary,
        children: React.ReactNode
    }
) {
    return (
        <ThemeProvider>
            <LanguageDictionaryProvider dictionary={dictionary}>
                {children}
            </LanguageDictionaryProvider>
        </ThemeProvider>
    )
}