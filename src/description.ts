import { DEFAULT_LOCALE_DESCRIPTION } from './constants'
import { Descriptions, LocalizedJSONSchema } from './types'
import { isNotEmpty } from './utils'

export function getDescriptions (schema: LocalizedJSONSchema, localeDescription: string = DEFAULT_LOCALE_DESCRIPTION): Descriptions {
  const description = isNotEmpty(schema.description) ? schema.description : undefined
  const descriptions = schema.descriptions

  if (descriptions == null) {
    return description != null ? { [localeDescription]: description } : {}
  }

  if (description != null && !Object.keys(descriptions).includes(localeDescription)) {
    descriptions[localeDescription] = description
  }
  return descriptions
}

export function getLocalizedDescription (schema: LocalizedJSONSchema, locale: string, localeDescription?: string): string | undefined {
  return getDescriptions(schema, localeDescription)[locale]
}
