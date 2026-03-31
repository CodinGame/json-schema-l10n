import { JSONSchema6 } from 'json-schema'

export const DESCRIPTION_KEY_EN = 'en'
export const DESCRIPTION_KEY_FR = 'fr'
export const DESCRIPTION_KEY_ES = 'es'

export type Descriptions = {
  [DESCRIPTION_KEY_EN]?: string,
  [DESCRIPTION_KEY_FR]?: string,
  [DESCRIPTION_KEY_ES]?: string,
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
