import { JSONSchema6, JSONSchema6Definition } from 'json-schema'
import { DEFAULT_DESCRIPTION_LOCALE } from './constants'
import { LocalizedJSONSchema, LocalizedJSONSchemaDefinition } from './types'
import { isNotEmpty } from './utils'

export function getDescription (schema: LocalizedJSONSchema, locale: string = DEFAULT_DESCRIPTION_LOCALE): string | undefined {
  const description = isNotEmpty(schema.description) ? schema.description : undefined
  return schema.descriptions?.[locale] ?? description
}

function renderSimpleJsonSchema (locale: string, schema?: LocalizedJSONSchemaDefinition): JSONSchema6Definition | undefined {
  return schema == null
    ? undefined
    : typeof schema === 'boolean'
      ? schema
      : renderJsonSchema(schema, locale)
}

function renderArrayOfJsonSchema (locale: string, array?: LocalizedJSONSchemaDefinition[]): JSONSchema6Definition[] | undefined {
  return array?.map(schema => renderSimpleJsonSchema(locale, schema) as JSONSchema6Definition)
}

function renderObjectOfJsonSchema (locale: string, object?: { [key: string]: LocalizedJSONSchemaDefinition }): { [key: string]: JSONSchema6Definition } | undefined {
  return object == null
    ? undefined
    : Object.entries(object).reduce((newSchema, [key, schema]) => ({
      ...newSchema,
      [key]: renderSimpleJsonSchema(locale, schema)
    }), {})
}

export function renderJsonSchema (schema: LocalizedJSONSchema, locale: string): JSONSchema6 {
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
      [key]: Array.isArray(schema) ? schema : renderSimpleJsonSchema(locale, schema)
    }), {})

  return {
    ...jsonSchema,
    items: Array.isArray(items)
      ? renderArrayOfJsonSchema(locale, items)
      : renderSimpleJsonSchema(locale, items),
    additionalItems: renderSimpleJsonSchema(locale, additionalItems),
    contains: renderSimpleJsonSchema(locale, contains),
    properties: renderObjectOfJsonSchema(locale, properties),
    patternProperties: renderObjectOfJsonSchema(locale, patternProperties),
    additionalProperties: renderSimpleJsonSchema(locale, additionalProperties),
    dependencies: newDependencies,
    propertyNames: renderSimpleJsonSchema(locale, propertyNames),
    allOf: renderArrayOfJsonSchema(locale, allOf),
    anyOf: renderArrayOfJsonSchema(locale, anyOf),
    oneOf: renderArrayOfJsonSchema(locale, oneOf),
    not: renderSimpleJsonSchema(locale, not),
    definitions: renderObjectOfJsonSchema(locale, definitions),
    description: description ?? jsonSchema.description
  }
}
