'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { FileIcon, FolderIcon, PlusIcon } from 'lucide-react'
import { useFileSystem } from '@/hooks/useFileSystem'
import { useParams } from 'next/navigation'
import { useRef, useState, MouseEvent, ChangeEvent } from 'react'
import { ROOT_FOLDER_ID } from '@/contexts/FileSystemContext.constants'

export default function CreateItemPopover() {
  const { createFolder, uploadFile } = useFileSystem()
  const params = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  const currentFolderId = params?.id ? String(params.id) : ROOT_FOLDER_ID

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      await uploadFile(currentFolderId === ROOT_FOLDER_ID ? null : currentFolderId, file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setOpen(false)
  }

  const handleCreateFolder = async () => {
    await createFolder(currentFolderId === ROOT_FOLDER_ID ? null : currentFolderId, 'New Folder')
    setOpen(false)
  }

  const handlePopoverClick = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="mb-3" asChild>
        <Button className="rounded-full" variant="outline" size="icon-lg">
          <PlusIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="ml-2.5 w-32 flex flex-col items-start"
        onClick={handlePopoverClick}
      >
        <Button
          className="flex gap-2 w-full justify-between"
          onClick={handleCreateFolder}
          variant="ghost"
        >
          Folder <FolderIcon />
        </Button>
        <Button
          className="flex gap-2 w-full justify-between"
          variant="ghost"
          onClick={handleFileUpload}
        >
          File <FileIcon />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
