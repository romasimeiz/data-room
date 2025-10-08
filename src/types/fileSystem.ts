export type NodeType = 'folder' | 'file'

export enum NodeTypeEnum {
  Folder = 'folder',
  File = 'file',
}

export interface FileSystemItem {
  id: string
  name: string
  type: NodeType
  parentId: string | null
  createdAt: Date
  fileData?: SerializableFile
  file?: File
}

export interface SerializableFile {
  name: string
  type: string
  size: number
  lastModified: number
  arrayBuffer: ArrayBuffer
}
