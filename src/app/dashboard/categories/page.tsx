"use client"

import { useEffect, useState } from "react"
import { CategoryForm } from "@/components/forms/category-form"
import { ScrapItemForm } from "@/components/forms/scrap-item-form"
import { SearchFilter } from "@/components/search-filter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import categoryService from "@/services/category.api"


const filterOptions = [
  { value: "all", label: "All Categories" },
  { value: "withScrap", label: "Categories with Scrap" },
  { value: "withoutScrap", label: "Categories without Scrap" },
]

export default function CategoriesPage() {

  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ; (async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scrap Categories</h1>
        <div className="space-x-2">
          <CategoryForm />
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
              <CardTitle>{category.name}</CardTitle>
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
    </div>
  )
}

