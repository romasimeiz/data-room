import { FileSystemItem } from '@/types/fileSystem'

export interface FileSystemContextType {
  items: FileSystemItem[]
  getItemsByParentId: (parentId: string | null) => FileSystemItem[]
  createFolder: (parentId: string | null, name: string) => Promise<void>
  uploadFile: (parentId: string | null, file: File) => Promise<void>
  renameNode: (nodeId: string, newName: string) => Promise<void>
  deleteNode: (nodeId: string) => Promise<void>
  getFolderById: (folderId: string) => FileSystemItem | null
  isLoading: boolean
}
