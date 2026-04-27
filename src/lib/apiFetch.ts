import type { ZodType } from 'zod'

export const apiFetch = <T>(path: string, schema: ZodType<T>, options?: RequestInit): Promise<T> =>
  fetch(path, { credentials: 'include', ...options }).then(async (res) => {
    if (!res.ok) throw new Error(`API Error: ${res.status}`)
    return schema.parse(await res.json())
  })
