import { JSONSchema6, JSONSchema6Definition } from 'json-schema'
import { DEFAULT_DESCRIPTION_LOCALE } from './constants'
import { DESCRIPTION_KEY_EN, DESCRIPTION_KEY_FR, DESCRIPTION_KEY_ES, LocalizedJSONSchema, LocalizedJSONSchemaDefinition } from './types'
import { isNotEmpty } from './utils'

function getDescription (schema: LocalizedJSONSchema, locale: string = DEFAULT_DESCRIPTION_LOCALE): string | undefined {
  const description = isNotEmpty(schema.description) ? schema.description : undefined
  let d
  if (schema.descriptions === undefined) {
    d = description
  } else if (locale == DESCRIPTION_KEY_EN) {
    d = schema.descriptions[DESCRIPTION_KEY_EN]
  } else if (locale == DESCRIPTION_KEY_FR) {
    d = schema.descriptions[DESCRIPTION_KEY_FR]
  } else if (locale == DESCRIPTION_KEY_ES) {
    d = schema.descriptions[DESCRIPTION_KEY_ES]
  }
  return d
}

function renderArrayOfJsonSchema (locale: string, array?: LocalizedJSONSchemaDefinition[]): JSONSchema6Definition[] | undefined {
  return array?.map(schema => renderJsonSchema(locale, schema)).filter((schema): schema is JSONSchema6Definition => schema != null)
}

function renderObjectOfJsonSchema (locale: string, object?: { [key: string]: LocalizedJSONSchemaDefinition }): { [key: string]: JSONSchema6Definition } | undefined {
  return object == null
    ? undefined
    : Object.entries(object).reduce((newSchema, [key, schema]) => ({
      ...newSchema,
      [key]: renderJsonSchema(locale, schema)
    }), {})
}

function renderJsonSchema (locale: string, schema: LocalizedJSONSchema): JSONSchema6
function renderJsonSchema (locale: string, schema: boolean): boolean
function renderJsonSchema (locale: string, schema: undefined): undefined
function renderJsonSchema (locale: string, schema?: LocalizedJSONSchemaDefinition): JSONSchema6Definition | undefined
function renderJsonSchema (locale: string, schema?: LocalizedJSONSchemaDefinition): JSONSchema6Definition | undefined {
  if (schema == null) {
    return undefined
  } else if (typeof schema === 'boolean') {
    return schema
  }

  if (locale != DESCRIPTION_KEY_EN && locale != DESCRIPTION_KEY_FR && locale != DESCRIPTION_KEY_ES) {
    throw new Error('Wrong locale')
  }

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
      [key]: Array.isArray(schema) ? schema : renderJsonSchema(locale, schema)
    }), {})

  return {
    ...jsonSchema,
    items: Array.isArray(items)
      ? renderArrayOfJsonSchema(locale, items)
      : renderJsonSchema(locale, items),
    additionalItems: renderJsonSchema(locale, additionalItems),
    contains: renderJsonSchema(locale, contains),
    properties: renderObjectOfJsonSchema(locale, properties),
    patternProperties: renderObjectOfJsonSchema(locale, patternProperties),
    additionalProperties: renderJsonSchema(locale, additionalProperties),
    dependencies: newDependencies,
    propertyNames: renderJsonSchema(locale, propertyNames),
    allOf: renderArrayOfJsonSchema(locale, allOf),
    anyOf: renderArrayOfJsonSchema(locale, anyOf),
    oneOf: renderArrayOfJsonSchema(locale, oneOf),
    not: renderJsonSchema(locale, not),
    definitions: renderObjectOfJsonSchema(locale, definitions),
    description: description ?? jsonSchema.description
  }
}

export { getDescription, renderJsonSchema }
