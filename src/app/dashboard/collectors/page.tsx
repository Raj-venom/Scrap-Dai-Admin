"use client"

import { use, useEffect, useState } from "react"
import { CollectorForm } from "@/components/forms/collector-form"
import { CollectorDetailsModal } from "@/components/collector-details-modal"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import collectorService from "@/services/collector.api"

const filterOptions = [
  { value: "all", label: "All Collectors" },
  // { value: "active", label: "Active Collectors" },
  // { value: "inactive", label: "Inactive Collectors" },
]

const CollectorsPage = () => {

  const [collectors, setCollectors] = useState<Collector[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [selectedCollector, setSelectedCollector] = useState<(typeof collectors)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ; (async () => {
      try {
        const response = await collectorService.getAllCollectors();
        setCollectors(response.data);
      } catch (error) {
        console.error("Error fetching collectors:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);


  const filteredCollectors = collectors.filter((collector) => {
    const matchesSearch =
      collector.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collector.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collector.phone.includes(searchTerm) ||
      collector.current_address.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterValue === "all") return matchesSearch
    // if (filterValue === "active") return matchesSearch && collector.orders.length > 0
    // if (filterValue === "inactive") return matchesSearch && collector.orders.length === 0

    return matchesSearch
  })



  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading collectors...</p>
      </div>
    );


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scrap Collectors</h1>
        <CollectorForm />
      </div>
      <SearchFilter onSearch={setSearchTerm} onFilter={setFilterValue} filterOptions={filterOptions} />
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCollectors.map((collector) => (
              <TableRow key={collector._id}>
                <TableCell className="font-medium">{collector.fullName}</TableCell>
                <TableCell>{collector.email}</TableCell>
                <TableCell>{collector.phone}</TableCell>
                <TableCell>{collector.current_address}</TableCell>
                <TableCell>{new Date(collector.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCollector(collector)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CollectorDetailsModal
        collector={selectedCollector}
        isOpen={!!selectedCollector}
        onClose={() => setSelectedCollector(null)}
      />

    </div>
  )
}

export default CollectorsPage