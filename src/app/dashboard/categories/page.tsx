"use client"

import { useEffect, useState } from "react"
import { CategoryForm } from "@/components/forms/category-form"
import { ScrapItemForm } from "@/components/forms/scrap-item-form"
import { SearchFilter } from "@/components/search-filter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import categoryService from "@/services/category.api"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const filterOptions = [
  { value: "all", label: "All Categories" },
  { value: "withScrap", label: "Categories with Scrap" },
  { value: "withoutScrap", label: "Categories without Scrap" },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await categoryService.getAllCategories()
      setCategories(response.data)
    } catch (error: any) {
      console.error("Error fetching categories:", error)
      toast.error(`Failed to load categories: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const data = {
      _id: editingCategory._id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      categoryImage: formData.get("image") as File | null
    }

    try {
      await categoryService.updateCategory(data)
      toast.success("Category updated successfully")
      setEditingCategory(null)
      fetchCategories()
    } catch (error: any) {
      console.error("Error updating category:", error)
      toast.error(`Failed to update category: ${error.message}`)
    }
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return

    try {
      await categoryService.deleteCategory(categoryToDelete)
      toast.success("Category deleted successfully")
      setDeleteDialogOpen(false)
      fetchCategories()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast.error(`Failed to delete category: ${error.message}`)
    } finally {
      setCategoryToDelete(null)
    }
  }

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterValue === "all") return matchesSearch
    if (filterValue === "withScrap") return matchesSearch && category.scraps.length > 0
    if (filterValue === "withoutScrap") return matchesSearch && category.scraps.length === 0

    return matchesSearch
  })

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading categories...</p>
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scrap Categories</h1>
        <div className="space-x-2">
          <CategoryForm onSubmitFinished={fetchCategories} />
          <ScrapItemForm categories={categories} />
        </div>
      </div>

      <SearchFilter onSearch={setSearchTerm} onFilter={setFilterValue} filterOptions={filterOptions} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category._id} className="flex flex-col">
            <CardHeader>
              <div className="aspect-video relative mb-2">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={400}
                  height={250}
                  className="object-cover rounded-md"
                  priority />
              </div>
              <div className="flex justify-between items-center">
                <CardTitle>{category.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCategoryToDelete(category._id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Price/Kg</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.scraps.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>रु {item.pricePerKg.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details below
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={editingCategory.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  defaultValue={editingCategory.description}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Category Image</Label>
                <div className="aspect-video relative mb-2">
                  <Image
                    src={editingCategory.image || "/placeholder.svg"}
                    alt={editingCategory.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to keep current image
                </p>
              </div>
              <Button type="submit" className="w-full">
                Update Category
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}