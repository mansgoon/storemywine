"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Camera, Upload } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from 'next/navigation'
import { WINE_TYPES } from '../../constants/wineTypes';
import { createClient } from '@supabase/supabase-js'
import { LoadingSpinner } from '@/components/LoadingSpinner'

let supabase;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is missing');
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

if (!supabase) {
  console.error('Supabase client failed to initialize')
}

export default function WineScanAndEditPage() {
  const [wineData, setWineData] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef(null)
  const router = useRouter()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleError = (error) => {
      console.error('Caught error:', error)
      setError(error.message)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  useEffect(() => {
    // Simulate any initialization process
    setTimeout(() => setIsLoading(false), 100)
  }, [])

  const handleImageUpload = async (e) => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Supabase client is not initialized. Please check your configuration.",
        variant: "destructive",
      });
      return;
    }

    const file = e.target.files[0]
    if (file) {
      setIsScanning(true)
      try {
        // Upload image to Supabase
        const { data, error } = await supabase.storage
          .from('temp-wine-images')
          .upload(`${Date.now()}_${file.name}`, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Supabase storage error:', error);
          throw error;
        }

        // Get public URL of the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('temp-wine-images')
          .getPublicUrl(data.path)

        // Scan the image using our API route
        const response = await fetch('/api/scan-wine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: publicUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to scan wine image');
        }

        const scannedWineDetails = await response.json();

        setWineData(scannedWineDetails)
        toast({
          title: "Wine Scanned Successfully",
          description: "Please review and edit the details if needed.",
        })

        // Delete the temporary image after scanning
        await supabase.storage
          .from('temp-wine-images')
          .remove([data.path])

      } catch (error) {
        console.error('Error processing image:', error)
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

    try {
      const response = await fetch('/api/wines/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wineData),
      })

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.details || result.error || 'Failed to create wine');
        }
        toast({
          title: "Wine Added",
          description: `${result.name} has been added to your cellar.`,
        });
        setWineData(null);
        router.push('/');
      } else {
        // If the response is not JSON, it's likely an error page
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Received an unexpected response from the server');
      }
    } catch (error) {
      console.error('Error creating wine:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add wine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">
          An error occurred: {error}
        </div>
      </div>
    )
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
                {isScanning ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner className="text-[#8c6d46]" />
                    <p className="text-center text-[#6b5236] animate-pulse">Analyzing your wine...</p>
                  </div>
                ) : (
                  <p className="text-center text-[#6b5236]">Scan your wine bottle to get started</p>
                )}
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
                      {WINE_TYPES.map((type) => (
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