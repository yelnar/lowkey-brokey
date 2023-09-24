import { resolve } from 'pathe'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const resolvePath = (path: string) => resolve(__dirname, path)

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolvePath('src/index.ts'),
      name: 'index',
      // the proper extensions will be added
      fileName: 'index',
    },
  },
  plugins: [dts()],
})
