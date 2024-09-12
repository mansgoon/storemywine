"use client"
import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Camera, Upload } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"

const wineTypes = ["Red", "White", "Sparkling", "Rosé", "Dessert", "Fortified"]

// Simulated GPT API response
const simulateGPTResponse = async (imageFile) => {
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
  return {
    name: "Château Margaux 2015",
    type: "Red",
    region: "Bordeaux, France",
    description: "An exceptional vintage with notes of dark berries, tobacco, and a hint of vanilla. Full-bodied with silky tannins and a long, complex finish."
  }
}

export default function WineScanAndEditPage() {
  const [wineData, setWineData] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsScanning(true)
      try {
        const scannedWineDetails = await simulateGPTResponse(file)
        setWineData(scannedWineDetails)
        toast({
          title: "Wine Scanned Successfully",
          description: "Please review and edit the details if needed.",
        })
      } catch (error) {
        toast({
          title: "Scan Failed",
          description: "Unable to scan the wine. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsScanning(false)
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setWineData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setWineData(prev => ({ ...prev, type: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Here you would typically send the wineData to your backend
    console.log('Submitted wine:', wineData)

    toast({
      title: "Wine Added",
      description: `${wineData.name} has been added to your cellar.`,
    })

    setWineData(null)
    setIsSubmitting(false)
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow min-h-screen bg-gradient-to-br from-[#f5e6d3] to-[#e8d5b5] flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-lg bg-[#f9f3e8] bg-opacity-40 border border-[#d1b894] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#8c6d46]">Add New Wine</CardTitle>
          </CardHeader>
          <CardContent>
            {!wineData ? (
              <div className="space-y-6">
                <p className="text-center text-[#6b5236]">Scan your wine bottle to get started</p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => fileInputRef.current.click()}
                    disabled={isScanning}
                    className="bg-[#8c6d46] hover:bg-[#6b5236] text-white"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {isScanning ? 'Scanning...' : 'Scan Bottle'}
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current.click()}
                    disabled={isScanning}
                    variant="outline"
                    className="border-[#8c6d46] text-[#8c6d46] hover:bg-[#8c6d46] hover:text-white"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#6b5236]">Wine Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={wineData.name}
                    onChange={handleInputChange}
                    required
                    className="border-[#d1b894] focus:border-[#8c6d46] focus:ring focus:ring-[#d1b894] focus:ring-opacity-50 bg-[#f9f3e8] text-[#4a3728]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-[#6b5236]">Wine Type</Label>
                  <Select onValueChange={handleSelectChange} value={wineData.type}>
                    <SelectTrigger className="border-[#d1b894] focus:border-[#8c6d46] focus:ring focus:ring-[#d1b894] focus:ring-opacity-50 bg-[#f9f3e8] text-[#4a3728]">
                      <SelectValue placeholder="Select wine type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#f9f3e8] border-[#d1b894]">
                      {wineTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-[#6b5236]">Region</Label>
                  <Input
                    id="region"
                    name="region"
                    value={wineData.region}
                    onChange={handleInputChange}
                    required
                    className="border-[#d1b894] focus:border-[#8c6d46] focus:ring focus:ring-[#d1b894] focus:ring-opacity-50 bg-[#f9f3e8] text-[#4a3728]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#6b5236]">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={wineData.description}
                    onChange={handleInputChange}
                    className="border-[#d1b894] focus:border-[#8c6d46] focus:ring focus:ring-[#d1b894] focus:ring-opacity-50 bg-[#f9f3e8] text-[#4a3728]"
                    rows={4}
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => setWineData(null)}
                    variant="outline"
                    className="border-[#8c6d46] text-[#8c6d46] hover:bg-[#8c6d46] hover:text-white"
                  >
                    Scan Again
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#8c6d46] hover:bg-[#6b5236] text-white"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Wine'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}