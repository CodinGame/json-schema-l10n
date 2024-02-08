import { describe, expect, test } from '@jest/globals'
import { Descriptions, LocalizedJSONSchema } from '../types'
import { renderJsonSchema, getDescriptions, getLocalizedDescription } from '../description'

const description: string = 'test description'
const englishDescription: string = 'english description'
const frenchDescription: string = 'french description'
const descriptions: Descriptions = {
  en: englishDescription,
  fr: frenchDescription
}
const fullSchema: LocalizedJSONSchema = {
  description,
  descriptions
}
const schemaWithoutDescription: LocalizedJSONSchema = {
  descriptions
}
const schemaWithoutDescriptions: LocalizedJSONSchema = {
  description
}
const nestedSchemas: LocalizedJSONSchema = {
  description,
  descriptions,
  items: [fullSchema, schemaWithoutDescription],
  additionalItems: false,
  contains: fullSchema,
  properties: {
    test1: schemaWithoutDescriptions,
    test2: fullSchema
  }
}

describe('Full schema', () => {
  test('Descriptions', () => {
    const localizedDescriptions: Descriptions = getDescriptions(fullSchema)
    expect(localizedDescriptions).toMatchObject(descriptions)
  })
  test('Localized description', () => {
    const english = getLocalizedDescription(fullSchema, 'en')
    const french = getLocalizedDescription(fullSchema, 'fr')
    expect(english).toMatch(englishDescription)
    expect(french).toMatch(frenchDescription)
  })
  test('Convert schema', () => {
    const englishSchema = renderJsonSchema(fullSchema, 'en')
    const frenchSchema = renderJsonSchema(fullSchema, 'fr')
    expect(englishSchema).toMatchObject({ description: englishDescription })
    expect(frenchSchema).toMatchObject({ description: frenchDescription })
  })
})

describe('Schema without description', () => {
  test('Descriptions', () => {
    const localizedDescriptions: Descriptions = getDescriptions(schemaWithoutDescription)
    expect(localizedDescriptions).toMatchObject(descriptions)
  })
  test('Localized description', () => {
    const english = getLocalizedDescription(schemaWithoutDescription, 'en')
    const french = getLocalizedDescription(schemaWithoutDescription, 'fr')
    expect(english).toMatch(englishDescription)
    expect(french).toMatch(frenchDescription)
  })
  test('Convert schema', () => {
    const englishSchema = renderJsonSchema(schemaWithoutDescription, 'en')
    const frenchSchema = renderJsonSchema(schemaWithoutDescription, 'fr')
    expect(englishSchema).toMatchObject({ description: englishDescription })
    expect(frenchSchema).toMatchObject({ description: frenchDescription })
  })
})

describe('Schema without descriptions', () => {
  test('Descriptions', () => {
    const localizedDescriptions: Descriptions = getDescriptions(schemaWithoutDescriptions)
    expect(localizedDescriptions).toMatchObject({ en: description })
  })
  test('Localized description', () => {
    const english = getLocalizedDescription(schemaWithoutDescriptions, 'en')
    const french = getLocalizedDescription(schemaWithoutDescriptions, 'fr')
    expect(english).toMatch(description)
    expect(french).toBeUndefined()
  })
  test('Convert schema', () => {
    const englishSchema = renderJsonSchema(schemaWithoutDescriptions, 'en')
    const frenchSchema = renderJsonSchema(schemaWithoutDescriptions, 'fr')
    expect(englishSchema).toMatchObject({ description })
    expect(frenchSchema).toMatchObject({ description })
  })
})

describe('Nested schemas', () => {
  test('Descriptions', () => {
    const localizedDescriptions: Descriptions = getDescriptions(nestedSchemas)
    expect(localizedDescriptions).toMatchObject(descriptions)
  })
  test('Localized description', () => {
    const english = getLocalizedDescription(nestedSchemas, 'en')
    const french = getLocalizedDescription(nestedSchemas, 'fr')
    expect(english).toMatch(englishDescription)
    expect(french).toMatch(frenchDescription)
  })
  test('Convert schema', () => {
    const englishSchema = renderJsonSchema(nestedSchemas, 'en')
    const frenchSchema = renderJsonSchema(nestedSchemas, 'fr')
    expect(englishSchema).toMatchObject({
      description: englishDescription,
      items: [{ description: englishDescription }, { description: englishDescription }],
      additionalItems: false,
      contains: { description: englishDescription },
      properties: {
        test1: { description },
        test2: { description: englishDescription }
      }
    })
    expect(frenchSchema).toMatchObject({
      description: frenchDescription,
      items: [{ description: frenchDescription }, { description: frenchDescription }],
      additionalItems: false,
      contains: { description: frenchDescription },
      properties: {
        test1: { description },
        test2: { description: frenchDescription }
      }
    })
  })
})
