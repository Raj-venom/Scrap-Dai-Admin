"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"
import { Loader2, PencilIcon } from "lucide-react"
import toast from "react-hot-toast"

interface ScrapDetailsDialogProps {
  scrap: Scrap | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedScrap: UpdateScrapDetailsParams) => Promise<void>
}

export function ScrapDetailsDialog({ scrap, isOpen, onClose, onUpdate }: ScrapDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<{
    name: string
    description: string
    pricePerKg: number
    previewImage?: string
    imageFile?: File
    category?: string
  }>({
    name: "",
    description: "",
    pricePerKg: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  // Reset form when scrap changes
  useEffect(() => {
    if (scrap) {
      setFormData({
        name: scrap.name,
        description: scrap.description,
        pricePerKg: scrap.pricePerKg,
        category: scrap.category.name,
      })
      setIsEditing(false)
    }
  }, [scrap])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({
          ...formData,
          previewImage: reader.result as string,
          imageFile: file,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async () => {
    if (!scrap) return

    setIsLoading(true)
    try {
      const updateParams: UpdateScrapDetailsParams = {
        _id: scrap._id,
        name: formData.name,
        description: formData.description,
        pricePerKg: formData.pricePerKg,
        scrapImage: formData.imageFile || null,
      }

      await onUpdate(updateParams)
      setIsEditing(false)
    } catch (error: any) {
      toast.error(`Failed to update scrap item: ${error?.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (scrap) {
      setFormData({
        name: scrap.name,
        description: scrap.description,
        pricePerKg: scrap.pricePerKg,
      })
    }
    setIsEditing(false)
  }


  if (!scrap) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Scrap Item Details</DialogTitle>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          )}
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Section */}
          <Card>
            <CardContent className="p-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                <Image
                  src={formData.previewImage || scrap.scrapImage || "/placeholder.svg"}
                  alt={formData.name || "Scrap item"}
                  fill
                  className="object-contain"
                />
              </div>
              {isEditing && (
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <Button className="w-full" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Change Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details Section */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label>Name</Label>
              {isEditing ? (
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              ) : (
                <div className="py-2">{scrap.name}</div>
              )}
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="py-2">{scrap.category.name}</div>
            </div>

            {/* Price Field */}
            <div className="space-y-2">
              <Label>Price per Kg (रु )</Label>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerKg}
                  onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                />
              ) : (
                <div className="py-2">रु {scrap.pricePerKg.toFixed(2)}</div>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label>Description</Label>
              {isEditing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              ) : (
                <div className="py-2">{scrap.description}</div>
              )}
            </div>


            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={handleUpdate} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

