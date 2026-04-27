// 環境フラグ（将来、環境ごとの出し分けが必要になったら有効化する）
// export type Environment = 'dev' | 'stg' | 'prd'

// export const ENVIRONMENT = (import.meta.env['VITE_ENVIRONMENT'] ??
//   'dev') as Environment

// export const IS_DEV = ENVIRONMENT === 'dev'
// export const IS_STG = ENVIRONMENT === 'stg'
// export const IS_PRD = ENVIRONMENT === 'prd'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
