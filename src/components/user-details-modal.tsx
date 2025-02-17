"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Order {
    id: number
    date: string
    items: { name: string; quantity: number; price: number }[]
    total: number
}

interface User {
    id: number
    email: string
    fullName: string
    phone: string
    gender: string
    avatar: string
    current_address: string
    isverified: boolean
    role: string
    createdAt: string
    orders: Order[]
}

interface UserDetailsModalProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
}

export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
    const [orderFilter, setOrderFilter] = useState("all")

    if (!user) return null

    const filterOrders = (orders: Order[]) => {
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

        switch (orderFilter) {
            case "today":
                return orders.filter((order) => new Date(order.date).toDateString() === now.toDateString())
            case "week":
                return orders.filter((order) => new Date(order.date) >= oneWeekAgo)
            case "month":
                return orders.filter((order) => new Date(order.date) >= oneMonthAgo)
            case "year":
                return orders.filter((order) => new Date(order.date) >= oneYearAgo)
            default:
                return orders
        }
    }

    const filteredOrders = filterOrders(user.orders)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-center mb-4">
                                    <Image
                                        src={user.avatar || "/placeholder.svg"}
                                        alt={user.fullName}
                                        width={100}
                                        height={100}
                                        className="rounded-full"
                                    />
                                </div>
                                <p>
                                    <strong>Name:</strong> {user.fullName}
                                </p>
                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {user.phone}
                                </p>
                                <p>
                                    <strong>Gender:</strong> {user.gender}
                                </p>
                                <p>
                                    <strong>Address:</strong> {user.current_address}
                                </p>
                                <p>
                                    <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Verified:</strong> {user.isverified ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Role:</strong> {user.role}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <Select onValueChange={setOrderFilter} defaultValue={orderFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter orders" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Orders</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="week">This Week</SelectItem>
                                        <SelectItem value="month">This Month</SelectItem>
                                        <SelectItem value="year">This Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{order.items.map((item) => item.name).join(", ")}</TableCell>
                                            <TableCell>₹{order.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

