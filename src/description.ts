import { JSONSchema6 } from 'json-schema'
import { DEFAULT_DESCRIPTION_LOCALE } from './constants'
import { Descriptions, LocalizedJSONSchema, LocalizedSchemaTypes, getValueTypeWithKey } from './types'
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

function convertJsonSchemaInObject (object: { [key: string]: unknown }, locale: string, descriptionLocale?: string): { [key: string]: unknown } {
  return Object.entries(object).reduce((json, [key, value]) => {
    if (value == null) {
      return { ...json }
    }
    const valueType = getValueTypeWithKey(key, value)
    if (valueType === LocalizedSchemaTypes.LOCALIZED_SCHEMA) {
      return { ...json, [key]: renderJsonSchema(value as LocalizedJSONSchema, locale, descriptionLocale) }
    }
    if (Array.isArray(value) && valueType === LocalizedSchemaTypes.ARRAY_OF_LOCALIZED_SCHEMA) {
      return { ...json, [key]: value.map(schema => renderJsonSchema(schema, locale, descriptionLocale)) }
    }
    if (valueType === LocalizedSchemaTypes.OBJECT_OF_LOCALIZED_SCHEMA) {
      return { ...json, [key]: convertJsonSchemaInObject({ ...value }, locale, descriptionLocale) }
    }
    return { ...json, [key]: value }
  }, {})
}

export function renderJsonSchema (schema: LocalizedJSONSchema, locale: string, descriptionLocale?: string): JSONSchema6 {
  const description = getLocalizedDescription(schema, locale, descriptionLocale)
  const { descriptions, ...jsonSchema } = schema
  return {
    ...convertJsonSchemaInObject(jsonSchema, locale, descriptionLocale),
    description: description ?? jsonSchema.description
  }
}
