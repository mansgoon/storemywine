"use client"

import React, { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs";
import Link from 'next/link'
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Star, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Sidebar } from "./Sidebar"
import { getAllWines, toggleWineDrunkStatus, updateWineRating, deleteWine } from '../queries/wineQueries'
import { useToast } from "@/hooks/use-toast"
import { WINE_TYPE_COLORS } from '../constants/wineTypes';

export function BeigeWineDashboard() {
  const { user, isLoaded } = useUser();
  const [wines, setWines] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [groupBy, setGroupBy] = useState("none")
  const { toast } = useToast()

  useEffect(() => {
    if (isLoaded && user) {
      fetchWines()
    }
  }, [isLoaded, user])

  const fetchWines = async () => {
    if (user) {
      try {
        const fetchedWines = await getAllWines()
        setWines(fetchedWines)
      } catch (error) {
        console.error('Error fetching wines:', error)
        // Handle error (e.g., show a toast notification)
      }
    }
  }

  const handleDrunkToggle = async (id) => {
    const originalWines = [...wines]
    const wineIndex = wines.findIndex(wine => wine.id === id)
    const updatedWines = [...wines]
    const newIsDrunk = !updatedWines[wineIndex].isDrunk
    updatedWines[wineIndex] = { 
      ...updatedWines[wineIndex], 
      isDrunk: newIsDrunk,
      rating: newIsDrunk ? updatedWines[wineIndex].rating : 0 // Reset rating to 0 if marked as undrunk
    }
    setWines(updatedWines)

    try {
      await toggleWineDrunkStatus(id)
    } catch (error) {
      console.error('Error toggling wine drunk status:', error)
      setWines(originalWines)
      toast({
        title: "Error",
        description: "Failed to update wine status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRatingChange = async (id, rating) => {
    const originalWines = [...wines]
    const wineIndex = wines.findIndex(wine => wine.id === id)
    const updatedWines = [...wines]
    updatedWines[wineIndex] = { ...updatedWines[wineIndex], rating }
    setWines(updatedWines)

    try {
      await updateWineRating(id, rating)
    } catch (error) {
      console.error('Error updating wine rating:', error)
      setWines(originalWines)
      toast({
        title: "Error",
        description: "Failed to update wine rating. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteWine = async (id) => {
    try {
      await deleteWine(id)
      setWines(wines.filter(wine => wine.id !== id))
      toast({
        title: "Wine Deleted",
        description: "The wine has been removed from your cellar.",
      })
    } catch (error) {
      console.error('Error deleting wine:', error)
      toast({
        title: "Error",
        description: "Failed to delete wine. Please try again.",
        variant: "destructive",
      })
    }
  }

  const sortedWines = [...wines].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name)
    if (sortBy === "type") return a.type.localeCompare(b.type)
    if (sortBy === "region") return a.region.localeCompare(b.region)
    if (sortBy === "rating") return b.rating - a.rating
    return 0
  })

  const groupedWines = sortedWines.reduce((acc, wine) => {
    const key = groupBy === "none" ? "All Wines" : wine[groupBy]
    if (!acc[key]) acc[key] = []
    acc[key].push(wine)
    return acc
  }, {})

  const filteredWines = Object.entries(groupedWines).reduce((acc, [group, wines]) => {
    acc[group] = wines.filter(wine =>
      wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.region.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return acc
  }, {})

  const getWineTypeColor = (type) => {
    const lowerType = type.toLowerCase();
    return WINE_TYPE_COLORS[lowerType] || '#d1d5db';
  };

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please sign in to view your wine collection.</div>
  }

  return (
    <div className="min-h-screen bg-[#f5e6d3]">
      <Sidebar />
      <div className="container mx-auto p-4 pt-20">
        <header className="py-8 text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#8c6d46] mb-4 max-sm:text-3xl tracking-tight">
            storemywine.online
          </h1>
          <p className="text-lg text-[#6b5236] mb-4 max-sm:text-base">discover, track, and rate your wine collection</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Search wines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border-[#d1b894] focus:border-[#8c6d46] focus:ring focus:ring-[#d1b894] focus:ring-opacity-50 bg-[#f9f3e8] text-[#4a3728]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c6d46]" />
            </div>
            <Select onValueChange={setSortBy} defaultValue="name">
              <SelectTrigger className="w-full md:w-[180px] bg-[#f9f3e8] border-[#d1b894] text-[#4a3728]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#f9f3e8] border-[#d1b894]">
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="type">Sort by Type</SelectItem>
                <SelectItem value="region">Sort by Region</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setGroupBy} defaultValue="none">
              <SelectTrigger className="w-full md:w-[180px] bg-[#f9f3e8] border-[#d1b894] text-[#4a3728]">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent className="bg-[#f9f3e8] border-[#d1b894]">
                <SelectItem value="none">No Grouping</SelectItem>
                <SelectItem value="type">Group by Type</SelectItem>
                <SelectItem value="region">Group by Region</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        {Object.entries(filteredWines).map(([group, wines]) => (
          wines.length > 0 && (
            <div key={group} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#6b5236]">{group}</h2>
                {group === "All Wines" && (
                  <Link href="/upload">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-[#f9f3e8] text-[#6b5236] border-[#d1b894] hover:bg-[#e8d5b5]"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Wine
                    </Button>
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wines.map((wine) => (
                  <motion.div
                    key={wine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="w-full h-full overflow-hidden backdrop-blur-lg bg-[#f9f3e8] bg-opacity-40 border border-[#d1b894] shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Checkbox
                                id={`drunk-${wine.id}`}
                                checked={wine.isDrunk}
                                onCheckedChange={() => handleDrunkToggle(wine.id)}
                                className="border-2 border-[#8c6d46]"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{wine.isDrunk ? "Mark as undrunk" : "Mark as drunk"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <CardTitle className="flex-1 text-lg font-semibold text-[#4a3728]">{wine.name}</CardTitle>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-[#f9f3e8] text-[#6b5236] border-[#d1b894] hover:bg-[#e8d5b5]">Quick View</Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95%] sm:max-w-lg bg-[#f9f3e8] text-[#4a3728] max-h-[90vh] overflow-y-auto z-40 rounded-lg">
                            <DialogHeader>
                              <DialogTitle className="text-[#6b5236]">{wine.name}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 px-2 sm:px-4">
                              <div className="grid grid-cols-3 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                <span className="text-right font-bold col-span-1">Type:</span>
                                <span className="col-span-2 sm:col-span-3">{wine.type}</span>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                <span className="text-right font-bold col-span-1">Region:</span>
                                <span className="col-span-2 sm:col-span-3">{wine.region}</span>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                <span className="text-right font-bold col-span-1">Status:</span>
                                <span className="col-span-2 sm:col-span-3">{wine.isDrunk ? "Drunk" : "Not drunk"}</span>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                                <span className="text-right font-bold col-span-1">Rating:</span>
                                <span className="col-span-2 sm:col-span-3">
                                  {wine.isDrunk ? (
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-4 w-4 ${
                                            star <= wine.rating ? 'text-[#d4af37] fill-[#d4af37]' : 'text-[#d1b894]'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  ) : "Not rated"}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                                <span className="text-right font-bold col-span-1">Description:</span>
                                <span className="col-span-2 sm:col-span-3">{wine.description}</span>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  handleDeleteWine(wine.id);
                                  document.querySelector(`[data-state="open"]`).click(); // Close the dialog
                                }}
                                className="bg-red-400 text-white hover:bg-red-500"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Wine
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent className="flex-grow"></CardContent>
                      <CardFooter className="pt-2 pb-4 flex justify-between items-center">
                        <div className="text-sm text-[#6b5236]">
                          <p className="flex items-center">
                            <span 
                              className="inline-block w-3 h-3 rounded-full mr-2"
                              style={{backgroundColor: getWineTypeColor(wine.type)}}
                            ></span>
                            Type: {wine.type}
                          </p>
                          <p>Region: {wine.region}</p>
                        </div>
                        <AnimatePresence>
                          {wine.isDrunk && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center"
                            >
                              <div className="flex space-x-1 bg-[#f9f3e8] bg-opacity-90 rounded-full px-2 py-1 shadow-md">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 cursor-pointer transition-colors duration-150 ${
                                      star <= wine.rating ? 'text-[#d4af37] fill-[#d4af37]' : 'text-[#d1b894]'
                                    }`}
                                    onClick={() => handleRatingChange(wine.id, star)}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}