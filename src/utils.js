export function toKey(value) {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'object') {
    if (value.id) {
      return value.id
    }
    if (value.toJSON) {
      return value.toJSON()
    }
  }

  return JSON.stringify(value)
}

export function equal(valueA, valueB) {
  if (valueA === valueB) {
    return true
  }
  if (!valueA || !valueB) {
    return false
  }
  if (typeof valueA === 'object' && typeof valueB === 'object') {
    if (valueA.id === valueB.id) {
      return true
    }
    if (valueA.toJSON && valueB.toJSON) {
      return valueA.toJSON() === valueB.toJSON()
    }

    return JSON.stringify(valueA) === JSON.stringify(valueB)
  }

  return false
}

export function isArray(val) {
  if (Array.isArray(val)) {
    return true
  }
  if (val && val.map) {
    return true
  }

  return false
}

export function getValueOptions(options, value) {
  if (isArray(value)) {
    return value.map(item => options.find(option => option.value === item))
  }

  return options.filter(option => option.value === value)
}

export function getDocument() {
  if (typeof document !== 'undefined') {
    return document
  }

  return undefined
}

export function getWindow() {
  if (typeof window !== 'undefined') {
    return window
  }

  return undefined
}

export function getWindowInnerHeight(defaultHeight = 700) {
  const window = getWindow()
  if (window) {
    return window.innerHeight
  }

  return defaultHeight
}

export const keys = {
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ENTER: 13,
  TAB: 9,
  ESC: 27,
  BACKSPACE: 8,
  SPACE: 32
}
