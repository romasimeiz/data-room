import { FileSystemItem } from '@/types/fileSystem'

const DB_NAME = 'DataroomDB'
const DB_VERSION = 1
const STORE_NAME = 'fileSystemItems'

class IndexedDBService {
  private db: IDBDatabase | null = null

  private ensureDB(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    return this.db
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result

        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })

        store.createIndex('parentId', 'parentId', { unique: false })
        store.createIndex('name', 'name', { unique: false })
      }
    })
  }

  async getAllItems(): Promise<FileSystemItem[]> {
    const db = this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getItemsByParentId(parentId: string | null): Promise<FileSystemItem[]> {
    const db = this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('parentId')
      const request = index.getAll(parentId)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveItem(item: FileSystemItem): Promise<void> {
    const db = this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteItem(id: string): Promise<void> {
    const db = this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getItem(id: string): Promise<FileSystemItem | undefined> {
    const db = this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export const indexedDBService = new IndexedDBService()
