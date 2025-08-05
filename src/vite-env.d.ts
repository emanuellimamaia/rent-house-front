/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // adicione mais variáveis conforme necessário
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}
