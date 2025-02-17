"use client"

import { useState } from "react"
import { CategoryForm } from "@/components/forms/category-form"
import { ScrapItemForm } from "@/components/forms/scrap-item-form"
import { SearchFilter } from "@/components/search-filter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

// Mock data for categories and scrap items
const categories = [
  {
    id: 1,
    name: "Metal",
    description: "Various metal scraps",
    image: "/placeholder.svg",
    items: [
      { id: 1, name: "Copper Wire", description: "Stripped copper wire", pricePerKg: 5.5 },
      { id: 2, name: "Aluminum Cans", description: "Crushed aluminum cans", pricePerKg: 1.2 },
    ],
  },
  {
    id: 2,
    name: "Paper",
    description: "All types of paper waste",
    image: "/placeholder.svg",
    items: [
      { id: 3, name: "Cardboard", description: "Flattened cardboard boxes", pricePerKg: 0.3 },
      { id: 4, name: "Newspapers", description: "Old newspapers", pricePerKg: 0.25 },
    ],
  },
  {
    id: 3,
    name: "Plastic",
    description: "Different plastic materials",
    image: "/placeholder.svg",
    items: [
      { id: 5, name: "PET Bottles", description: "Clear plastic bottles", pricePerKg: 0.4 },
      { id: 6, name: "HDPE Containers", description: "High-density polyethylene containers", pricePerKg: 0.35 },
    ],
  },
]

const filterOptions = [
  { value: "all", label: "All Categories" },
  { value: "withItems", label: "Categories with Items" },
  { value: "withoutItems", label: "Categories without Items" },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterValue === "all") return matchesSearch
    if (filterValue === "withItems") return matchesSearch && category.items.length > 0
    if (filterValue === "withoutItems") return matchesSearch && category.items.length === 0

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scrap Categories</h1>
        <div className="space-x-2">
          <CategoryForm />
          <ScrapItemForm />
        </div>
      </div>
      <SearchFilter onSearch={setSearchTerm} onFilter={setFilterValue} filterOptions={filterOptions} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="flex flex-col">
            <CardHeader>
              <div className="aspect-video relative mb-2">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover rounded-md"
                />
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
                  {category.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>₹{item.pricePerKg.toFixed(2)}</TableCell>
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

