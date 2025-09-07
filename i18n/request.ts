import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import en from '../messages/en.json'
import de from '../messages/de.json'
import pt from '../messages/pt.json'

const messages = {
  en,
  de,
  pt
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !['en', 'de', 'pt'].includes(locale)) notFound()

  return {
    messages: messages[locale as keyof typeof messages],
    locale
  }
})