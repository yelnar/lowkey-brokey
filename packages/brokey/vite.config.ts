import { resolve } from 'pathe'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const resolvePath = (path: string) => resolve(__dirname, path)

export default defineConfig({
  build: {
    lib: {
      entry: resolvePath('src/index.ts'),
      name: 'brokey',
      fileName: 'index',
    },
  },
  plugins: [dts()],
})
