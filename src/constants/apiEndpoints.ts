/**
 * API エンドポイント URL の一元管理
 *
 * すべての API URL はここで定義します。
 * クエリ・ハンドラー・型定義から参照して、URL の重複を避けます。
 *
 * 詳細は .claude/rules/api-design.md を参照。
 */

export const API_ENDPOINTS = {
  // User API
  USER_INFO: '/api/userInfo',
} as const
