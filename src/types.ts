import { JSONSchema6 } from 'json-schema'

export type Descriptions = {
  [key: string]: string
}

export interface LocalizedJSONSchema extends JSONSchema6 {
  descriptions?: Descriptions
}
