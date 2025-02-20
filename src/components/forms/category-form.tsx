"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import categoryService from "@/services/category.api"

export function CategoryForm() {
    const [open, setOpen] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const data: AddNewCategoryParams = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            categoryImage: formData.get("image") as File
        }

        try {
            const response = await categoryService.addNewCategory(data)
            console.log(response)

            if (response.success) {
                alert("Category added successfully")
                setOpen(false)
            } else {
                alert(`Error adding category, ${response.message}`)
            }

        } catch (error: any) {
            console.error(error.message)
            alert(`Error adding category, ${error.message}`)
        }

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add New Category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Category</DialogTitle>
                    <DialogDescription>
                        Add a new category
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Category Name</Label>
                        <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image">Category Image</Label>
                        <Input id="image" name="image" type="file" accept="image/*" required />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        Create Category
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

