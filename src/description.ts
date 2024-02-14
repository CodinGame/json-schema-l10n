import { JSONSchema6, JSONSchema6Definition } from 'json-schema'
import { DEFAULT_DESCRIPTION_LOCALE } from './constants'
import { LocalizedJSONSchema, LocalizedJSONSchemaDefinition } from './types'
import { isNotEmpty } from './utils'

export function getDescription (schema: LocalizedJSONSchema, locale: string = DEFAULT_DESCRIPTION_LOCALE): string | undefined {
  const description = isNotEmpty(schema.description) ? schema.description : undefined
  return schema.descriptions?.[locale] ?? description
}

function renderSimpleJsonSchema (locale: string, schema?: LocalizedJSONSchemaDefinition, descriptionLocale?: string): JSONSchema6Definition | undefined {
  return schema == null
    ? undefined
    : typeof schema === 'boolean'
      ? schema
      : renderJsonSchema(schema, locale, descriptionLocale)
}

function renderArrayOfJsonSchema (locale: string, array?: LocalizedJSONSchemaDefinition[], descriptionLocale?: string): JSONSchema6Definition[] | undefined {
  return array?.map(schema => renderSimpleJsonSchema(locale, schema, descriptionLocale) as JSONSchema6Definition)
}

function renderObjectOfJsonSchema (locale: string, object?: { [key: string]: LocalizedJSONSchemaDefinition }, descriptionLocale?: string): { [key: string]: JSONSchema6Definition } | undefined {
  return object == null
    ? undefined
    : Object.entries(object).reduce((newSchema, [key, schema]) => ({
      ...newSchema,
      [key]: renderSimpleJsonSchema(locale, schema, descriptionLocale)
    }), {})
}

export function renderJsonSchema (schema: LocalizedJSONSchema, locale: string, descriptionLocale?: string): JSONSchema6 {
  const description = getDescription(schema, locale)
  const {
    descriptions,
    items,
    additionalItems,
    contains,
    properties,
    patternProperties,
    additionalProperties,
    dependencies,
    propertyNames,
    allOf,
    anyOf,
    oneOf,
    not,
    definitions,
    ...jsonSchema
  } = schema

  const newDependencies = dependencies == null
    ? undefined
    : Object.entries(dependencies).reduce((newSchema, [key, schema]) => ({
      ...newSchema,
      [key]: Array.isArray(schema) ? schema : renderSimpleJsonSchema(locale, schema, descriptionLocale)
    }), {})

  return {
    ...jsonSchema,
    items: Array.isArray(items)
      ? renderArrayOfJsonSchema(locale, items, descriptionLocale)
      : renderSimpleJsonSchema(locale, items, descriptionLocale),
    additionalItems: renderSimpleJsonSchema(locale, additionalItems, descriptionLocale),
    contains: renderSimpleJsonSchema(locale, contains, descriptionLocale),
    properties: renderObjectOfJsonSchema(locale, properties, descriptionLocale),
    patternProperties: renderObjectOfJsonSchema(locale, patternProperties, descriptionLocale),
    additionalProperties: renderSimpleJsonSchema(locale, additionalProperties, descriptionLocale),
    dependencies: newDependencies,
    propertyNames: renderSimpleJsonSchema(locale, propertyNames, descriptionLocale),
    allOf: renderArrayOfJsonSchema(locale, allOf, descriptionLocale),
    anyOf: renderArrayOfJsonSchema(locale, anyOf, descriptionLocale),
    oneOf: renderArrayOfJsonSchema(locale, oneOf, descriptionLocale),
    not: renderSimpleJsonSchema(locale, not, descriptionLocale),
    definitions: renderObjectOfJsonSchema(locale, definitions, descriptionLocale),
    description: description ?? jsonSchema.description
  }
}
