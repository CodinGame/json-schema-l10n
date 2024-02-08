import { DEFAULT_DESCRIPTION_LOCALE } from './constants'
import { Descriptions, LocalizedJSONSchema } from './types'
import { isNotEmpty } from './utils'

export function getDescriptions (schema: LocalizedJSONSchema, descriptionLocale: string = DEFAULT_DESCRIPTION_LOCALE): Descriptions {
  const description = isNotEmpty(schema.description) ? schema.description : undefined
  const descriptions = schema.descriptions

  if (descriptions == null) {
    return description != null ? { [descriptionLocale]: description } : {}
  }

  if (description != null && !Object.keys(descriptions).includes(descriptionLocale)) {
    descriptions[descriptionLocale] = description
  }
  return descriptions
}

export function getLocalizedDescription (schema: LocalizedJSONSchema, locale: string, descriptionLocale?: string): string | undefined {
  return getDescriptions(schema, descriptionLocale)[locale]
}
