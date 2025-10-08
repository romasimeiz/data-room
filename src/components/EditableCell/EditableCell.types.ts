import { FileSystemItem } from '@/types/fileSystem'
import { MouseEvent } from 'react'

export type EditableCellProps = {
  fileSystemItem: FileSystemItem
  handleNameClick: (e: MouseEvent) => void
  saveEditing: () => void
  cancelEditing: () => void
  isEditing: boolean
  editingName: string
  onSaveEditingName: (name: string) => void
  onDoubleClick: () => void
}
