import { API_BASE_URL } from './environment'

/**
 * API エンドポイント URL の一元管理
 *
 * すべての API URL はここで定義します。
 * クエリ・ハンドラー・型定義から参照して、URL の重複を避けます。
 *
 * API_BASE_URL は環境（dev/stg/prod）ごとに異なります。
 * 詳細は .claude/rules/api-design.md を参照。
 */

const buildUrl = (path: string) => `${API_BASE_URL}${path}`

export const API_ENDPOINTS = {
  // Common API
  USER_INFO: buildUrl('/api/user/info'),
  BATCH_DATE: buildUrl('/api/batch/date'),

  // SampleA API
  SAMPLE_A_TYPE1: buildUrl('/api/sample_a/type_1'),
  SAMPLE_A_TYPE2: buildUrl('/api/sample_a/type_2'),

  // SampleB API
  SAMPLE_B_TYPE1: buildUrl('/api/sample_b/type_1'),
} as const
