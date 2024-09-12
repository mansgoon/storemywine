"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { LogOut, Menu, PlusCircle, Wine, Home } from "lucide-react"
import { motion } from "framer-motion"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const recentWines = [
  { id: 1, name: "Château Margaux 2015", type: "Red" },
  { id: 2, name: "Cloudy Bay Sauvignon Blanc 2020", type: "White" },
  { id: 3, name: "Dom Pérignon 2010", type: "Sparkling" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 bg-[#f9f3e8] border border-[#d1b894] text-[#8c6d46] hover:bg-[#e8d5b5]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <motion.div
        className="fixed left-0 top-0 h-full bg-[#f9f3e8] border-r border-[#d1b894] shadow-lg z-40 flex flex-col"
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-4 mt-16 w-60 flex flex-col gap-2 flex-grow overflow-y-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-[#8c6d46] hover:bg-[#e8d5b5] py-2 px-2"
            onClick={() => router.push("/")}
          >
            <Home className="mr-2 h-4 w-4 flex-shrink-0" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#8c6d46] hover:bg-[#e8d5b5] py-2 px-2"
            onClick={() => router.push("/upload")}
          >
            <PlusCircle className="mr-2 h-4 w-4 flex-shrink-0" />
            Add Wine
          </Button>
          
          <h3 className="text-[#6b5236] font-semibold mt-4 px-2">Recents</h3>
          <ul className="space-y-2">
            {recentWines.map((wine) => (
              <li key={wine.id} className="flex items-center text-[#4a3728] hover:bg-[#e8d5b5] cursor-pointer rounded transition-colors duration-200 py-2 px-2">
                <Wine className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate flex-grow min-w-0 text-sm">{wine.name}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-[#8c6d46] border border-[#d1b894] hover:bg-[#e8d5b5] py-2 px-2"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
            Sign Out
          </Button>
        </div>
      </motion.div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}