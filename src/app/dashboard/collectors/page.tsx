"use client"

import { useState } from "react"
import { CollectorForm } from "@/components/forms/collector-form"
import { CollectorDetailsModal } from "@/components/collector-details-modal"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


// Mock data for collectors
const collectors = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    current_address: "123 Main St",
    createdAt: "2023-01-01",
    profileImage: "/placeholder.svg",
    orders: [
      {
        id: 1,
        date: "2023-05-15",
        items: [
          { name: "Copper Wire", quantity: 5, price: 25 },
          { name: "Aluminum Cans", quantity: 10, price: 5 },
        ],
        total: 30,
      },
      {
        id: 2,
        date: "2023-06-01",
        items: [{ name: "Newspapers", quantity: 20, price: 10 }],
        total: 10,
      },
    ],
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane@example.com",
    phone: "0987654321",
    current_address: "456 Elm St",
    createdAt: "2023-02-15",
    profileImage: "/placeholder.svg",
    orders: [
      {
        id: 3,
        date: "2023-05-20",
        items: [{ name: "PET Bottles", quantity: 30, price: 15 }],
        total: 15,
      },
    ],
  },
  {
    id: 3,
    fullName: "Bob Johnson",
    email: "bob@example.com",
    phone: "5555555555",
    current_address: "789 Oak St",
    createdAt: "2023-03-30",
    profileImage: "/placeholder.svg",
    orders: [],
  },
]

const filterOptions = [
  { value: "all", label: "All Collectors" },
  { value: "active", label: "Active Collectors" },
  { value: "inactive", label: "Inactive Collectors" },
]

function CollectorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [selectedCollector, setSelectedCollector] = useState<(typeof collectors)[0] | null>(null)

  const filteredCollectors = collectors.filter((collector) => {
    const matchesSearch =
      collector.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collector.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collector.phone.includes(searchTerm) ||
      collector.current_address.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterValue === "all") return matchesSearch
    if (filterValue === "active") return matchesSearch && collector.orders.length > 0
    if (filterValue === "inactive") return matchesSearch && collector.orders.length === 0

    return matchesSearch
  })

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
              <TableRow key={collector.id}>
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