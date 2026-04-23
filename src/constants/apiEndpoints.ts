/**
 * API エンドポイント URL の一元管理
 *
 * すべての API URL はここで定義します。
 * クエリ・ハンドラー・型定義から参照して、URL の重複を避けます。
 *
 * 詳細は .claude/rules/api-design.md を参照。
 */

export const API_ENDPOINTS = {
  // Common API
  USER_INFO: '/api/user/info',
  BATCH_DATE: '/api/batch/date',

  // SampleA API
  SAMPLE_A_TYPE1: '/api/sample_a/type_1',
  SAMPLE_A_TYPE2: '/api/sample_a/type_2',

  // SampleB API
  SAMPLE_B_TYPE1: '/api/sample_b/type_1',
} as const
