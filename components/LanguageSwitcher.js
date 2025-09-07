'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('common')

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ]

  const switchLocale = (newLocale) => {
    if (newLocale === locale) return

    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

    // Navigate to new locale
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        className="appearance-none bg-white border border-neutral-bg-muted rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 cursor-pointer min-h-[44px]"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-neutral-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}