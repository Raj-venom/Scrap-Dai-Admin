"use client"

import { useState } from "react"
import { UserDetailsModal } from "@/components/user-details-modal"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for users based on the provided model
const users = [
  {
    id: 1,
    email: "alice@example.com",
    fullName: "Alice Johnson",
    phone: "1234567890",
    gender: "Female",
    avatar: "/placeholder.svg",
    current_address: "123 Main St, City, Country",
    isverified: true,
    role: "USER",
    createdAt: "2023-01-01T00:00:00.000Z",
    orders: [
      {
        id: 1,
        date: "2023-05-15",
        items: [
          { name: "Newspapers", quantity: 10, price: 5 },
          { name: "PET Bottles", quantity: 20, price: 10 },
        ],
        total: 15,
      },
      {
        id: 2,
        date: "2023-06-01",
        items: [{ name: "Cardboard", quantity: 5, price: 2.5 }],
        total: 2.5,
      },
    ],
  },
  {
    id: 2,
    email: "bob@example.com",
    fullName: "Bob Smith",
    phone: "0987654321",
    gender: "Male",
    avatar: "/placeholder.svg",
    current_address: "456 Elm St, Town, Country",
    isverified: false,
    role: "USER",
    createdAt: "2023-02-15T00:00:00.000Z",
    orders: [],
  },
]

const filterOptions = [
  { value: "all", label: "All Users" },
  { value: "verified", label: "Verified Users" },
  { value: "unverified", label: "Unverified Users" },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.current_address.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterValue === "all") return matchesSearch
    if (filterValue === "verified") return matchesSearch && user.isverified
    if (filterValue === "unverified") return matchesSearch && !user.isverified

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <SearchFilter onSearch={setSearchTerm} onFilter={setFilterValue} filterOptions={filterOptions} />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.isverified ? "Yes" : "No"}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UserDetailsModal user={selectedUser} isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  )
}

