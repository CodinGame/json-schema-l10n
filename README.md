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

- `getLocalizedDescription`:
  - takes in parameters a schema with localized descriptions and the locale for which we want the description (default value is `'en'`)
  - returns the description for the wanted locale, or `undefined` if not found
- `renderJsonSchema`:
  - it can take in parameters the locale for which we want the description and a schema with localized descriptions and returns the `JSONSchema6` equivalent with the selected locale
  - it can take in parameters the locale for which we want the description and a boolean and returns the boolean
  - it can take in parameters the locale for which we want the description and an undefined schema and returns `undefined`
  - it can take in parameters the locale for which we want the description and an optional schema with localized descriptions or boolean and returns the `JSONSchema6Definition` equivalent with the selected locale
