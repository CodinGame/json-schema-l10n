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
