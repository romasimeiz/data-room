'use client'

import React, { createContext, useEffect, useState } from 'react'
import { FileSystemItem, NodeTypeEnum } from '@/types/fileSystem'
import { FileSystemContextType } from '@/contexts/FileSystemContext.types'
import {
  makeFileSystemItem,
  serializeFile,
  getUniqueFileName,
  deserializeFile,
} from '@/contexts/FileSystemContext.utils'
import { indexedDBService } from '@/services/indexedDBService'

export const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FileSystemItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await indexedDBService.init()

        const allItems = await indexedDBService.getAllItems()

        const itemsWithFiles = allItems.map(item => ({
          ...item,
          file: item.fileData ? deserializeFile(item.fileData) : undefined,
        }))

        setItems(itemsWithFiles)
      } catch (error) {
        console.error('Error initializing database:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void initializeDB()
  }, [])

  const getItemsByParentId = (parentId: string | null): FileSystemItem[] => {
    return items.filter(item => item.parentId === parentId)
  }

  const createFolder = async (parentId: string | null, name: string): Promise<void> => {
    try {
      const existingNames = items.filter(item => item.parentId === parentId).map(item => item.name)

      const uniqueName = getUniqueFileName(name, existingNames)
      const newFolder = makeFileSystemItem(uniqueName, NodeTypeEnum.Folder, parentId)

      await indexedDBService.saveItem(newFolder)
      setItems(prev => [...prev, newFolder])
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const uploadFile = async (parentId: string | null, file: File): Promise<void> => {
    try {
      const existingNames = items.filter(item => item.parentId === parentId).map(item => item.name)

      const uniqueName = getUniqueFileName(file.name, existingNames)
      const fileData = await serializeFile(file)
      const newFile = makeFileSystemItem(uniqueName, NodeTypeEnum.File, parentId, fileData)

      const newFileWithContent = { ...newFile, file }

      await indexedDBService.saveItem(newFile)
      setItems(prev => [...prev, newFileWithContent])
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const renameNode = async (nodeId: string, newName: string): Promise<void> => {
    try {
      const item = items.find(item => item.id === nodeId)
      if (!item) return

      const siblingNames = items
        .filter(i => i.parentId === item.parentId && i.id !== nodeId)
        .map(i => i.name)

      const uniqueName = getUniqueFileName(newName, siblingNames)
      const updatedItem = { ...item, name: uniqueName }

      const { file, ...itemToSave } = updatedItem
      await indexedDBService.saveItem(itemToSave)
      setItems(prev => prev.map(item => (item.id === nodeId ? updatedItem : item)))
    } catch (error) {
      console.error('Error renaming node:', error)
    }
  }

  const deleteNode = async (nodeId: string): Promise<void> => {
    try {
      const findAllDescendants = (id: string): string[] => {
        const descendants = [id]
        const children = items.filter(item => item.parentId === id)

        for (const child of children) {
          descendants.push(...findAllDescendants(child.id))
        }

        return descendants
      }

      const idsToDelete = findAllDescendants(nodeId)

      for (const id of idsToDelete) {
        await indexedDBService.deleteItem(id)
      }

      setItems(prev => prev.filter(item => !idsToDelete.includes(item.id)))
    } catch (error) {
      console.error('Error deleting node:', error)
    }
  }

  const getFolderById = (folderId: string): FileSystemItem | null => {
    const item = items.find(item => item.id === folderId && item.type === NodeTypeEnum.Folder)
    return item || null
  }

  const value: FileSystemContextType = {
    items,
    getItemsByParentId,
    createFolder,
    uploadFile,
    renameNode,
    deleteNode,
    getFolderById,
    isLoading,
  }

  return <FileSystemContext.Provider value={value}>{children}</FileSystemContext.Provider>
}
