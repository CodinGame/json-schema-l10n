import { describe, expect, test } from '@jest/globals'
import { Descriptions, LocalizedJSONSchema } from '../types'
import { renderJsonSchema, getDescription } from '../description'

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
  test('Localized description', () => {
    const english = getDescription(fullSchema, 'en')
    const french = getDescription(fullSchema, 'fr')
    expect(english).toMatch(englishDescription)
    expect(french).toMatch(frenchDescription)
  })
  test('Render schema', () => {
    const englishSchema = renderJsonSchema('en', fullSchema)
    const frenchSchema = renderJsonSchema('fr', fullSchema)
    expect(englishSchema).toMatchObject({ description: englishDescription })
    expect(frenchSchema).toMatchObject({ description: frenchDescription })
  })
})

describe('Schema without description', () => {
  test('Localized description', () => {
    const english = getDescription(schemaWithoutDescription, 'en')
    const french = getDescription(schemaWithoutDescription, 'fr')
    expect(english).toMatch(englishDescription)
    expect(french).toMatch(frenchDescription)
  })
  test('Render schema', () => {
    const englishSchema = renderJsonSchema('en', schemaWithoutDescription)
    const frenchSchema = renderJsonSchema('fr', schemaWithoutDescription)
    expect(englishSchema).toMatchObject({ description: englishDescription })
    expect(frenchSchema).toMatchObject({ description: frenchDescription })
  })
})

describe('Schema without descriptions', () => {
  test('Localized description', () => {
    const english = getDescription(schemaWithoutDescriptions, 'en')
    const french = getDescription(schemaWithoutDescriptions, 'fr')
    expect(english).toMatch(description)
    expect(french).toMatch(description)
  })
  test('Render schema', () => {
    const englishSchema = renderJsonSchema('en', schemaWithoutDescriptions)
    const frenchSchema = renderJsonSchema('fr', schemaWithoutDescriptions)
    expect(englishSchema).toMatchObject({ description })
    expect(frenchSchema).toMatchObject({ description })
  })
})

describe('Nested schemas', () => {
  test('Localized description', () => {
    const english = getDescription(nestedSchemas, 'en')
    const french = getDescription(nestedSchemas, 'fr')
    expect(english).toMatch(englishDescription)
    expect(french).toMatch(frenchDescription)
  })
  test('Render schema', () => {
    const englishSchema = renderJsonSchema('en', nestedSchemas)
    const frenchSchema = renderJsonSchema('fr', nestedSchemas)
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
