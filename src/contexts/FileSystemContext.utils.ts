import { FileSystemItem, NodeTypeEnum, SerializableFile } from '@/types/fileSystem'
import { v4 as uuid } from 'uuid'

export const makeDefaults = (id?: string) => ({ id: id ?? uuid(), createdAt: new Date() })

export const makeFileSystemItem = (
  name: string,
  type: NodeTypeEnum,
  parentId: string | null,
  fileData?: SerializableFile,
  id?: string
): FileSystemItem => {
  return {
    ...makeDefaults(id),
    name,
    type,
    parentId,
    fileData,
  }
}

export const serializeFile = async (file: File): Promise<SerializableFile> => {
  const arrayBuffer = await file.arrayBuffer()
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
    arrayBuffer,
  }
}

export const deserializeFile = (fileData: SerializableFile): File => {
  return new File([fileData.arrayBuffer], fileData.name, {
    type: fileData.type,
    lastModified: fileData.lastModified,
  })
}

export const getUniqueFileName = (baseName: string, existingNames: string[]): string => {
  if (!existingNames.includes(baseName)) {
    return baseName
  }

  let counter = 1
  let newName = `${baseName} (${counter})`

  while (existingNames.includes(newName)) {
    counter++
    newName = `${baseName} (${counter})`
  }

  return newName
}
