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

interface Collector {
    id: number
    fullName: string
    email: string
    phone: string
    current_address: string
    createdAt: string
    profileImage: string
    orders: Order[]
}

interface CollectorDetailsModalProps {
    collector: Collector | null
    isOpen: boolean
    onClose: () => void
}

export function CollectorDetailsModal({ collector, isOpen, onClose }: CollectorDetailsModalProps) {
    const [orderFilter, setOrderFilter] = useState("all")

    if (!collector) return null

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

    const filteredOrders = filterOrders(collector.orders)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Collector Details</DialogTitle>
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
                                        src={collector.profileImage || "/placeholder.svg"}
                                        alt={collector.fullName}
                                        width={100}
                                        height={100}
                                        className="rounded-full"
                                    />
                                </div>
                                <p>
                                    <strong>Name:</strong> {collector.fullName}
                                </p>
                                <p>
                                    <strong>Email:</strong> {collector.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {collector.phone}
                                </p>
                                <p>
                                    <strong>Address:</strong> {collector.current_address}
                                </p>
                                <p>
                                    <strong>Joined:</strong> {new Date(collector.createdAt).toLocaleDateString()}
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

