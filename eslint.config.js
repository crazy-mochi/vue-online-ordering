import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
])

//避免沒使用的變數造成無法存檔
module.exports = {
  extends: ['plugin:vue/vue3-recommended'],
  rules: {
    'no-unused-vars': 'off', // 全部關掉 (或)
    'vue/script-setup-uses-vars': 'error', // 告訴 eslint template 中會用到
  },
}
