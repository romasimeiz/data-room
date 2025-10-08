import { Input } from '@/components/ui/input'
import { TableCell } from '@/components/ui/table'
import { KeyboardEventHandler, ChangeEventHandler, FocusEventHandler } from 'react'
import { EditableCellProps } from '@/components/EditableCell/EditableCell.types'
import { FileIcon, FolderIcon } from 'lucide-react'
import { NodeTypeEnum } from '@/types/fileSystem'

const MAX_NAME_LENGTH = 50

export const EditableCell = ({
  fileSystemItem,
  handleNameClick,
  saveEditing,
  cancelEditing,
  isEditing,
  editingName,
  onSaveEditingName,
}: EditableCellProps) => {
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault()
    }
    if (e.key === 'Enter') {
      saveEditing()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = e => {
    const value = e.target.value
    if (value.length <= MAX_NAME_LENGTH) {
      onSaveEditingName(value)
    }
  }

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = e => {
    const length = e.target.value.length
    e.target.setSelectionRange(length, length)
  }

  return (
    <TableCell className="font-medium w-96 max-w-96">
      <div className="flex items-center gap-2 min-h-[30px]">
        <div className="flex-shrink-0">
          {fileSystemItem.type === NodeTypeEnum.Folder ? (
            <FolderIcon size={16} />
          ) : (
            <FileIcon size={16} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              type="text"
              className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 cursor-text"
              value={editingName}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={saveEditing}
              onFocus={handleOnFocus}
              maxLength={MAX_NAME_LENGTH}
              autoFocus
            />
          ) : (
            <span
              onClick={handleNameClick}
              className="cursor-pointer select-none block truncate text-sm leading-5"
              title={fileSystemItem.name}
            >
              {fileSystemItem.name}
            </span>
          )}
        </div>
      </div>
    </TableCell>
  )
}
