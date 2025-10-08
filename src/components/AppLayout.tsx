'use client'

import CreateItemPopover from '@/components/CreateItemPopover'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const shouldShowPopover = pathname !== '/not-found'

  return (
    <div className="p-6">
      {shouldShowPopover && <CreateItemPopover />}
      {children}
    </div>
  )
}
