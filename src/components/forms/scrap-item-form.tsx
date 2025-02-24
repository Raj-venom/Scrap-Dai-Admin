"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus } from "lucide-react"
import scrapService from "@/services/scrap.api"
import toast from "react-hot-toast"


export function ScrapItemForm({ categories }: { categories: Category[] }) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data: AddNewScrapParams = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            category: formData.get("category") as string,
            pricePerKg: parseFloat(formData.get("pricePerKg") as string),
            scrapImage: formData.get("scrapImage") as File
        }

        try {
            const response = await scrapService.addNewScrap(data)
            console.log(response)
            if (response.success) {
                toast.success(response.message)
                setOpen(false)
            } else {
                toast.error(`Error: ${response.message}`)
            }

        } catch (error: any) {
            toast.error(`Failed to add scrap item: ${error.message}`)
            console.error(error.message)

        } finally {
            setIsLoading(false)
        }

    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add New Scrap Item
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Scrap Item</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add a new scrap item
                </DialogDescription>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Item Name</Label>
                        <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category._id} value={category._id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pricePerKg">Price per Kg</Label>
                        <Input id="pricePerKg" name="pricePerKg" type="number" step="0.01" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="scrapImage">Scrap Image</Label>
                        <Input id="scrapImage" name="scrapImage" type="file" accept="image/*" required />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Scrap Item
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

