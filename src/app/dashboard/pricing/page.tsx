"use client"

import { useState, useEffect } from "react"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
// import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import scrapService from "@/services/scrap.api"



export interface PriceUpdate {
  _id: string
  pricePerKg: number
}



export default function PricingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [scraps, setScraps] = useState<Scrap[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [modifiedPrices, setModifiedPrices] = useState<Record<string, number>>({})
  // const { toast } = useToast()

  const filterOptions = [
    { value: "all", label: "All Categories" },
    ...Array.from(new Set(scraps.map((scrap) => scrap.category.slug))).map((slug) => ({
      value: slug,
      label: slug.charAt(0).toUpperCase() + slug.slice(1),
    })),
  ]

  useEffect(() => {
    loadScraps()
  }, [])

  const loadScraps = async () => {
    try {
      const response = await scrapService.getAllScraps()
      setScraps(response.data)
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to load scrap items",
      //   variant: "destructive",
      // })
    } finally {
      setLoading(false)
    }
  }

  const handlePriceChange = (_id: string, newPrice: number) => {
    setModifiedPrices((prev) => ({
      ...prev,
      [_id]: newPrice,
    }))
  }

  const handleSaveChanges = async () => {
    if (Object.keys(modifiedPrices).length === 0) return

    setUpdating(true)
    try {
      const updates: PriceUpdate[] = Object.entries(modifiedPrices).map(([_id, pricePerKg]) => ({
        _id,
        pricePerKg,
      }))

      await scrapService.updateMultipleScrapPrice(updates)

      // Update local state
      setScraps((prev) =>
        prev.map((scrap) => {
          const newPrice = modifiedPrices[scrap._id]
          return newPrice !== undefined ? { ...scrap, pricePerKg: newPrice } : scrap
        }),
      )

      setModifiedPrices({})

      // toast({
      //   title: "Success",
      //   description: "Prices updated successfully",
      // })
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to update prices",
      //   variant: "destructive",
      // })
    } finally {
      setUpdating(false)
    }
  }

  const handleReset = (_id: string) => {
    const { [_id]: _, ...rest } = modifiedPrices
    setModifiedPrices(rest)
  }

  const filteredScraps = scraps.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterValue === "all") return matchesSearch
    return matchesSearch && item.category.slug === filterValue
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Update Pricing</h1>
        <Button
          onClick={handleSaveChanges}
          disabled={Object.keys(modifiedPrices).length === 0 || updating}
          className="bg-primary hover:bg-primary/90"
        >
          {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Changes
        </Button>
      </div>

      <SearchFilter onSearch={setSearchTerm} onFilter={setFilterValue} filterOptions={filterOptions} />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Price (रु/kg)</TableHead>
              <TableHead>New Price (रु/kg)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScraps.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category.name}</TableCell>
                <TableCell>रु {item.pricePerKg.toFixed(2)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={modifiedPrices[item._id] ?? item.pricePerKg}
                    onChange={(e) => handlePriceChange(item._id, Number(e.target.value))}
                    step="0.01"
                    min="0"
                    className="w-28 border-gray-200"
                  />
                </TableCell>
                <TableCell>
                  {modifiedPrices[item._id] !== undefined && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReset(item._id)}
                      className="hover:bg-gray-100"
                    >
                      Reset
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
