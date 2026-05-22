import { reactConfig } from '@repo/eslint-config'
import eslintrcAutoImport from './.eslintrc-auto-import.json'

export default reactConfig([
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            globals: {
                ...eslintrcAutoImport.globals,
            },
        },
        rules: {
            // 确保 JSX 中未定义的组件会报错（但 globals 已声明，不会误报）
            'react/jsx-no-undef': ['error', { allowGlobals: true }],

            // 但在 TypeScript 项目中通常关闭，因为 TS 编译器会做, 保持关闭，避免双报错
            'no-undef': 'off',
        },
    },
])
