"use client"

import { useState } from "react"
import { ScrapItemForm } from "@/components//forms/scrap-item-form"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for scrap items
const scrapItems = [
  { id: 1, name: "Copper Wire", category: "Metal", description: "Stripped copper wire", pricePerKg: 5.5 },
  { id: 2, name: "Aluminum Cans", category: "Metal", description: "Crushed aluminum cans", pricePerKg: 1.2 },
  { id: 3, name: "Cardboard", category: "Paper", description: "Flattened cardboard boxes", pricePerKg: 0.3 },
  { id: 4, name: "Newspapers", category: "Paper", description: "Old newspapers", pricePerKg: 0.25 },
  { id: 5, name: "PET Bottles", category: "Plastic", description: "Clear plastic bottles", pricePerKg: 0.4 },
  {
    id: 6,
    name: "HDPE Containers",
    category: "Plastic",
    description: "High-density polyethylene containers",
    pricePerKg: 0.35,
  },
]

const filterOptions = [
  { value: "all", label: "All Categories" },
  { value: "Metal", label: "Metal" },
  { value: "Paper", label: "Paper" },
  { value: "Plastic", label: "Plastic" },
]

export default function ScrapItemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")

  const filteredItems = scrapItems.filter((item) => {
    // match with search term and category filter and description
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pricePerKg.toString().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterValue === "all") return matchesSearch
    return matchesSearch && item.category === filterValue
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scrap Items</h1>
        <ScrapItemForm />
      </div>
      <SearchFilter onSearch={setSearchTerm} onFilter={setFilterValue} filterOptions={filterOptions} />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price/Kg</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>₹{item.pricePerKg.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

