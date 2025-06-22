import { useState } from 'react'

/**
 * useFormData - generic form state and helpers for deeply nested object editing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFormData<T extends Record<string, any>>(initialData: T) {
  const [formData, setFormData] = useState<T>(initialData)

  // Get value at dot-path
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getValueAtPath(obj: any, path: string): any {
    if (!path) return obj
    return path.split('.').reduce((acc, key) => {
      if (acc == null) return undefined
      if (Array.isArray(acc) && !isNaN(Number(key))) {
        return (acc as unknown[])[Number(key)]
      }
      return (acc as Record<string, unknown>)[key]
    }, obj)
  }

  // Set value at dot-path (immutably)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setValueAtPath(obj: any, path: string, value: any): any {
    if (!path) return value
    const keys = path.split('.')
    const lastKey = keys.pop()!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root: any = Array.isArray(obj) ? [...obj] : { ...obj }
    let curr = root
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const nextKey = keys[i + 1]
      if (!isNaN(Number(nextKey))) {
        curr[key] = Array.isArray(curr[key]) ? [...curr[key]] : []
      } else {
        curr[key] = curr[key] !== undefined ? { ...curr[key] } : {}
      }
      curr = curr[key]
    }
    if (Array.isArray(curr) && !isNaN(Number(lastKey))) {
      curr[Number(lastKey)] = value
    } else {
      curr[lastKey] = value
    }
    return root
  }

  // Change handler for any field
  const handleFieldChange = (path: string, value: unknown) => {
    setFormData((prev: T) => setValueAtPath(prev, path, value) as T)
  }

  // Array add/remove helpers
  const handleArrayAdd = (path: string) => {
    setFormData((prev: T) => {
      const arr = getValueAtPath(prev, path) || []
      return setValueAtPath(prev, path, [...arr, '']) as T
    })
  }
  const handleArrayRemove = (path: string, idx: number) => {
    setFormData((prev: T) => {
      const arr = getValueAtPath(prev, path) || []
      return setValueAtPath(
        prev,
        path,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        arr.filter((_: any, i: number) => i !== idx)
      ) as T
    })
  }

  return {
    formData,
    setFormData,
    getValueAtPath,
    setValueAtPath,
    handleFieldChange,
    handleArrayAdd,
    handleArrayRemove,
  }
}
