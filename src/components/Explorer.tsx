import { FileSystemItem, NodeTypeEnum } from '@/types/fileSystem'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFileSystem } from '@/hooks/useFileSystem'
import { getFormattedDate } from '@/utils/datetime'
import { useState, MouseEvent } from 'react'
import { EditableCell } from '@/components/EditableCell/EditableCell'

const CLICK_DELAY_MS = 300

interface ExplorerProps {
  parentId: string | null
}

export default function Explorer({ parentId }: ExplorerProps) {
  const router = useRouter()
  const { deleteNode, renameNode, getItemsByParentId, isLoading } = useFileSystem()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>('')
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)

  const items = getItemsByParentId(parentId)

  const handleDoubleClick = (item: FileSystemItem) => () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
    }
    if (item.type === NodeTypeEnum.Folder && editingId !== item.id) {
      router.push(`/folders/${item.id}`)
    } else if (item.file && editingId !== item.id) {
      if (item.file.type === 'application/pdf') {
        const fileURL = URL.createObjectURL(item.file)
        window.open(fileURL, '_blank')
      }
    }
  }

  const startEditing = (item: FileSystemItem) => {
    setEditingId(item.id)
    setEditingName(item.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  const saveEditing = async () => {
    if (editingId && editingName.trim()) {
      const currentItem = items.find((item: FileSystemItem) => item.id === editingId)
      if (currentItem) {
        const newName = editingName.trim()
        if (newName !== currentItem.name) {
          await renameNode(editingId, newName)
        }
      }
    }
    cancelEditing()
  }

  const handleNameClick = (item: FileSystemItem) => (e: MouseEvent) => {
    e.stopPropagation()

    if (editingId === item.id) return

    if (clickTimeout) {
      clearTimeout(clickTimeout)
    }

    const timeout = setTimeout(() => {
      if (editingId === null) {
        startEditing(item)
      }
      setClickTimeout(null)
    }, CLICK_DELAY_MS)

    setClickTimeout(timeout)
  }

  const handleDelete = (nodeId: string) => async () => {
    await deleteNode(nodeId)
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <Table className="table-fixed w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold w-96 max-w-96">Name</TableHead>
          <TableHead className="w-20 font-bold">Author</TableHead>
          <TableHead className="w-24 font-bold text-right">Created at</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!items.length && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              <b>...</b>
            </TableCell>
          </TableRow>
        )}
        {items.map((item: FileSystemItem) => {
          const isEditing = editingId === item.id
          return (
            <TableRow className="group" key={item.id}>
              <EditableCell
                onDoubleClick={handleDoubleClick(item)}
                fileSystemItem={item}
                isEditing={isEditing}
                cancelEditing={cancelEditing}
                saveEditing={saveEditing}
                handleNameClick={handleNameClick(item)}
                editingName={editingName}
                onSaveEditingName={setEditingName}
              />
              <TableCell className="text-gray-500 w-20">John Doe</TableCell>
              <TableCell className="text-right w-24">{getFormattedDate(item.createdAt)}</TableCell>
              <TableCell className="text-right w-12">
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete(item.id)}
                >
                  <TrashIcon className="invisible group-hover:visible cursor-pointer" />
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
