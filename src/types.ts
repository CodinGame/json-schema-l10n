import { JSONSchema6 } from 'json-schema'

export type Descriptions = {
  [key: string]: string
}

export type LocalizedJSONSchemaDefinition = LocalizedJSONSchema | boolean

export interface LocalizedJSONSchema extends JSONSchema6 {
  descriptions?: Descriptions
  items?: LocalizedJSONSchemaDefinition | LocalizedJSONSchemaDefinition[]
  additionalItems?: LocalizedJSONSchemaDefinition
  contains?: LocalizedJSONSchemaDefinition
  properties?: {
      [k: string]: LocalizedJSONSchemaDefinition
  }
  patternProperties?: {
      [k: string]: LocalizedJSONSchemaDefinition
  }
  additionalProperties?: LocalizedJSONSchemaDefinition
  dependencies?: {
      [k: string]: LocalizedJSONSchemaDefinition | string[]
  }
  propertyNames?: LocalizedJSONSchemaDefinition
  allOf?: LocalizedJSONSchemaDefinition[]
  anyOf?: LocalizedJSONSchemaDefinition[]
  oneOf?: LocalizedJSONSchemaDefinition[]
  not?: LocalizedJSONSchemaDefinition
  definitions?: {
      [k: string]: LocalizedJSONSchemaDefinition
  }
}

export enum LocalizedSchemaTypes {
  ARRAY_OF_LOCALIZED_SCHEMA = 'ARRAY_OF_LOCALIZED_SCHEMA',
  OBJECT_OF_LOCALIZED_SCHEMA = 'OBJECT_OF_LOCALIZED_SCHEMA',
  LOCALIZED_SCHEMA = 'LOCALIZED_SCHEMA'
}
export function getValueTypeWithKey (key: string, value: unknown): string {
  if (value == null) {
    return typeof value
  }
  if (typeof value === 'object') {
    if (Array.isArray(value) && ['items', 'allOf', 'anyOf', 'oneOf'].includes(key)) {
      return LocalizedSchemaTypes.ARRAY_OF_LOCALIZED_SCHEMA
    }
    if (['properties', 'patternProperties', 'dependencies', 'definitions'].includes(key)) {
      return LocalizedSchemaTypes.OBJECT_OF_LOCALIZED_SCHEMA
    }
    if (['items', 'additionalItems', 'contains', 'additionalProperties', 'propertyNames', 'not'].includes(key) || Object.keys(value).includes('descriptions')) {
      return LocalizedSchemaTypes.LOCALIZED_SCHEMA
    }
    return 'object'
  }
  return typeof value
}
