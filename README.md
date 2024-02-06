# json-schema-l10n

This library uses `JSONSchema6` from the library `json-schema`.

It adds a localization object for the description of the JSON schema.

## Installation

```npm
npm install @codingame/json-schema-l10n
```

## Implementation

### Types

The implemented types are:

- `Descriptions`: an object that stores the localized descriptions by locale
- `LocalizedJSONSchema`: an interface that extends `JSONSchema6` with localized descriptions added

### Functions

The implemented functions are:

- `getDescriptions`:
  - takes in parameters a schema with localized descriptions and optionnaly the locale of the default description (default value is `'en'`)
  - returns the localized descriptions of the schema
- `getLocalizedDescription`:
  - takes in parameters a schema with localized descriptions, the locale for which we want the description and optionnaly the locale of the default description (default value is `'en'`)
  - returns the description for the wanted locale, or `undefined` if not found
