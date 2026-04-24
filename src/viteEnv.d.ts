/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_ENVIRONMENT: 'local' | 'dev' | 'stg' | 'prd'
  readonly VITE_API_BASE_URL: string
}

type ImportMeta = {
  readonly env: ImportMetaEnv
}
