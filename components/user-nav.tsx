'use client'

import { useState } from 'react'
import { signOut, useSession, signIn } from 'next-auth/react'
import { LogOut, User, LogIn} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function UserNav() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  
  if (status === "loading") {
      return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    }
    
    if (!session) {
        return (
        <Link 
        href="/login" 
        className='flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors'>
        <LogIn className="h-4 w-4" />
        Log in
      </Link>
    )
}

const user = session?.user
  return (
    <div className="relative">
      {/* Avatar Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200 hover:ring-2 hover:ring-gray-100 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      >
        {user?.image ? (
          <Image
            src={user.image} 
            alt={user.name || "User"} 
            className="h-full w-full object-cover"
            width={32}
            height={32}
          />
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-500" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible backdrop to close menu when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ""}
              </p>
            </div>
            
            <button
              onClick={() => signOut()}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  )
}