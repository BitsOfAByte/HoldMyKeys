export interface IKeyStore {

  read(key: string): TKeyData | null

  readAll(): TKeyData[]

  save(data: TKeyData, settings?: TSaveSettings): void

  saveBulk(data: TKeyData[]): Promise<void>

  saveBulkFromFile(filePath: string): Promise<unknown>
  
  update({ key, value, hashed }: TKeyData): void

  dump(filePath: string): Promise<unknown>
  
  remove(key: string): void

  removeBulk(keys: string[]): Promise<void>

  clear(): void
  
  size(): number

  isEqual(key: string, value: string): boolean

  isHashed(key: string): boolean

  exists(key: string): boolean
}

export type TKeyData = {
  key: string,
  value: string | object,
  hashed?: boolean
};

export type TKeyStoreSettings = {
  hashByDefault?: boolean
};

export type TKeyStoreInit = {
  settings?: TKeyStoreSettings,
  data?: TKeyData[],
};

export type TSaveSettings = { 
  overwrite?: boolean,
}
