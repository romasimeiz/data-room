'use client'

import Explorer from '@/components/Explorer'
import { useFileSystem } from '@/hooks/useFileSystem'
import { redirect, useParams } from 'next/navigation'

export default function FolderPage() {
  const { getFolderById, isLoading } = useFileSystem()
  const params = useParams()

  const folderId = String(params.id)

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>
  }

  const folder = getFolderById(folderId)

  if (!folder) return redirect('/not-found')

  return <Explorer parentId={folderId} />
}
