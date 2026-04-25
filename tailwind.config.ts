import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // NOTE: デザインシステムのルールは @.claude/rules/design-system.md を参照。
    colors: {
      // 基本色（必須）
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',
      inherit: 'inherit',
      current: 'currentColor',

      // プライマリカラー
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c3d66',
      },
      // セカンダリカラー
      secondary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      // ニュートラルカラー
      neutral: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      // 成功・エラー・警告色
      success: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
      },
      error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
      },
      warning: {
        50: '#fffbeb',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
      },
    },
    spacing: {
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      base: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      full: '9999px',
    },
    extend: {
      fontFamily: {
        // メインフォント（サンセリフ）
        sans: ['system-ui', 'sans-serif'],
        // モノスペース（コード表示用）
        mono: ['ui-monospace', 'monospace'],
      },
      boxShadow: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config
