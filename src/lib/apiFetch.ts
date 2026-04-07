export const apiFetch = <T>(path: string, options?: RequestInit): Promise<T> =>
  fetch(path, { credentials: 'include', ...options }).then(res => {
    if (!res.ok) throw new Error(`API Error: ${res.status}`)
    return res.json() as Promise<T>
  })
