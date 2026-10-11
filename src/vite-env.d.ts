/// <reference types="vite/client" />

declare module 'exceljs/dist/exceljs.bare.min.js' {
  const exceljs: unknown
  export default exceljs
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
