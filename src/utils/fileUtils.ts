import { FileNode, SerializableFile } from '@/types/fileSystem'

export const fileToSerializable = async (file: File): Promise<SerializableFile> => {
  const arrayBuffer = await file.arrayBuffer()
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
    arrayBuffer,
  }
}

export const serializeFileNode = async (node: FileNode): Promise<FileNode> => {
  if (node.type === 'file' && node.file instanceof File) {
    const serializableFile = await fileToSerializable(node.file)
    return {
      ...node,
      file: {
        ...serializableFile,
        arrayBuffer: Array.from(new Uint8Array(serializableFile.arrayBuffer)),
      } as unknown as File,
    }
  }

  if (node.children) {
    const children = await Promise.all(
      node.children.map((child: FileNode) => serializeFileNode(child))
    )
    return { ...node, children }
  }

  return node
}

export const deserializeFileNode = (node: FileNode): FileNode => {
  if (
    node.type === 'file' &&
    node.file &&
    'arrayBuffer' in node.file &&
    Array.isArray((node.file as unknown as { arrayBuffer: number[] }).arrayBuffer)
  ) {
    const fileData = node.file as unknown as {
      name: string
      type: string
      lastModified: number
      arrayBuffer: number[]
    }
    const arrayBuffer = new Uint8Array(fileData.arrayBuffer).buffer
    const file = new File([arrayBuffer], fileData.name, {
      type: fileData.type,
      lastModified: fileData.lastModified,
    })
    return { ...node, file }
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map((child: FileNode) => deserializeFileNode(child)),
    }
  }

  return node
}
