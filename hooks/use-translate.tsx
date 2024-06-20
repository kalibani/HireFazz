'use client'

import { Locale } from "@/i18n"
import changeLang from "@/lib/locale"
import { getClientSideCookie } from "@/lib/utils"
import { useEffect, useState } from "react"

export const useTranslate = () => {
    const [language, setLanguage] = useState<Locale>('id')
    const langCookie = getClientSideCookie('lang')

    useEffect(() => {
        if (langCookie) {
            setLanguage(langCookie as 'en' | 'id')
        }
      }, [langCookie])

    return {
        language,
        setLanguage: (lang: Locale) => {
            changeLang(lang)
        }
    }
}