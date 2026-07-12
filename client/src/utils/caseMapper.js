// The backend (Postgres/Express) speaks snake_case; the frontend speaks
// camelCase. These helpers convert flat API row objects (and arrays of
// them) between the two so each service file doesn't have to hand-map
// every field.

function snakeToCamelKey(key) {
  return key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())
}

function camelToSnakeKey(key) {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}

export function toCamel(value) {
  if (Array.isArray(value)) return value.map(toCamel)
  if (value === null || typeof value !== 'object') return value

  return Object.entries(value).reduce((acc, [key, val]) => {
    acc[snakeToCamelKey(key)] = val
    return acc
  }, {})
}

export function toSnake(value) {
  if (Array.isArray(value)) return value.map(toSnake)
  if (value === null || typeof value !== 'object') return value

  return Object.entries(value).reduce((acc, [key, val]) => {
    acc[camelToSnakeKey(key)] = val
    return acc
  }, {})
}
