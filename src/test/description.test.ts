import { describe, expect, test } from '@jest/globals'
import { Descriptions, LocalizedJSONSchema } from '../types'
import { getDescriptions, getLocalizedDescription } from '..'

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
})
