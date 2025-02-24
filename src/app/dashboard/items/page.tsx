"use client"

import { useEffect, useState } from "react"
import { ScrapItemForm } from "@/components//forms/scrap-item-form"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import scrapService from "@/services/scrap.api"
import categoryService from "@/services/category.api"
import { ScrapDetailsDialog } from "@/components/scrap-details-dialog"
import toast from "react-hot-toast"


export default function ScrapItemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [scrapItems, setScrapItems] = useState<Scrap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedScrap, setSelectedScrap] = useState<Scrap | null>(null)

  const filterOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((category) => ({ value: category.name, label: category.name })),
  ]

  useEffect(() => {
    ; (async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (!response.success) {
          toast.error(`Error: ${response.message}`)
        }
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    ; (async () => {
      try {
        const response = await scrapService.getAllScraps()
        if (!response.success) {
          toast.error(`Error: ${response.message}`)
          return
        }

        setScrapItems(response.data)
      } catch (error) {
        console.error("Error fetching scrap items:", error)
        toast.error("Failed to fetch scrap items")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])


  const handleUpdateScrap = async (updatedScrap: UpdateScrapDetailsParams) => {
    try {

      const response = await scrapService.updateScrapDetails(updatedScrap);

      if (!response.success) {
        toast.error(`Error: ${response.message}`);
        return;
      }

      const updatedScrapItem = response.data;

      setScrapItems((prevScrapItems) =>
        prevScrapItems.map((item) =>
          item._id === updatedScrapItem._id
            ? { ...updatedScrapItem, category: item.category }
            : item
        )
      );
      toast.success(response.message);


      setSelectedScrap(null);
    } catch (error: any) {
      toast.error(`Failed to update scrap item: ${error.message}`);
    }
  }


  const filteredItems = scrapItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pricePerKg.toString().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterValue === "all") return matchesSearch
    return matchesSearch && item.category.name === filterValue
  })

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading scrap items...</p>
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scrap Items</h1>
        <ScrapItemForm categories={categories} />
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
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>रु {item.pricePerKg.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedScrap(item)
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ScrapDetailsDialog
        scrap={selectedScrap}
        isOpen={!!selectedScrap}
        onClose={() => setSelectedScrap(null)}
        onUpdate={handleUpdateScrap}
      />
    </div>
  )
}

