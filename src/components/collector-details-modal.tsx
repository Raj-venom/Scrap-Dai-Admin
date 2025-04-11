"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import orderService from "@/services/order.api"

interface OrderItem {
    scrap: {
        _id: string;
        name: string;
    };
    weight: number;
    amount: number;
    _id: string;
}

interface Order {
    _id: string;
    pickUpDate: string;
    status: string;
    estimatedAmount: number;
    totalAmount?: number;
    orderItem: OrderItem[];
    pickUpTime: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        _id: string;
        fullName: string;
        phone: string;
    };
}



interface CollectorDetailsModalProps {
    collector: Collector | null;
    isOpen: boolean;
    onClose: () => void;
}

function CustomBadge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${className}`}>
            {children}
        </span>
    );
}

export function CollectorDetailsModal({ collector, isOpen, onClose }: CollectorDetailsModalProps) {
    const [orderFilter, setOrderFilter] = useState("all");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (collector && isOpen) {
            fetchOrders(orderFilter);
        }
    }, [collector, isOpen, orderFilter]);

    const fetchOrders = async (timeframe: string) => {
        if (!collector) return;

        setIsLoading(true);
        try {
            const response = await orderService.getCollectorOrderHistoryById(collector._id, timeframe);
            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!collector) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending": return "bg-yellow-200 text-yellow-800";
            case "accepted": return "bg-blue-200 text-blue-800";
            case "recycled": return "bg-green-200 text-green-800";
            default: return "bg-gray-200 text-gray-800";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const calculateTotal = (order: Order) => {
        return order.totalAmount || order.estimatedAmount ||
            order.orderItem.reduce((sum, item) => sum + item.amount, 0);
    };

    const getItemsText = (order: Order) => {
        return order.orderItem.map(item =>
            `${item.scrap.name} (${item.weight} kg)`
        ).join(", ");
    };

    const calculateOrderStats = () => {
        let totalWeight = 0;
        let totalAmount = 0;
        let pendingOrders = 0;
        let acceptedOrders = 0;
        let recycledOrders = 0;

        orders.forEach(order => {
            order.orderItem.forEach(item => {
                totalWeight += item.weight;
            });

            totalAmount += calculateTotal(order);

            switch (order.status.toLowerCase()) {
                case "pending": pendingOrders++; break;
                case "accepted": acceptedOrders++; break;
                case "recycled": recycledOrders++; break;
            }
        });

        return {
            totalWeight,
            totalAmount,
            pendingOrders,
            acceptedOrders,
            recycledOrders,
            totalOrders: orders.length
        };
    };

    const stats = calculateOrderStats();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Collector Details</DialogTitle>
                    <DialogDescription>
                        View details of {collector.fullName}
                    </DialogDescription>
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
                                        src={collector.avatar || "/placeholder.svg"}
                                        alt={collector.fullName}
                                        width={100}
                                        height={100}
                                        className="rounded-full w-24 h-24 object-cover"
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
                                    <strong>Joined:</strong> {formatDate(collector.createdAt)}
                                </p>
                                <p>
                                    <strong>Role:</strong> {collector.role}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Orders</div>
                                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Weight</div>
                                    <div className="text-2xl font-bold">{stats.totalWeight.toFixed(2)} kg</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Amount</div>
                                    <div className="text-2xl font-bold">रु {stats.totalAmount.toFixed(2)}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Status Breakdown</div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <CustomBadge className="bg-yellow-200 text-yellow-800">
                                            Pending: {stats.pendingOrders}
                                        </CustomBadge>
                                        <CustomBadge className="bg-blue-200 text-blue-800">
                                            Accepted: {stats.acceptedOrders}
                                        </CustomBadge>
                                        <CustomBadge className="bg-green-200 text-green-800">
                                            Recycled: {stats.recycledOrders}
                                        </CustomBadge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Order History</CardTitle>
                        <div className="w-[180px]">
                            <Select
                                value={orderFilter}
                                onValueChange={(value) => {
                                    setOrderFilter(value);
                                }}
                            >
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
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-4">Loading orders...</div>
                        ) : orders.length > 0 ? (
                            <div className="max-h-[500px] overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background">
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Weight</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((order) => {
                                            const totalWeight = order.orderItem.reduce((sum, item) => sum + item.weight, 0);

                                            return (
                                                <TableRow key={order._id}>
                                                    <TableCell>
                                                        <div>{formatDate(order.pickUpDate)}</div>
                                                        <div className="text-xs text-gray-500">{order.pickUpTime}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.user?.fullName || 'N/A'}
                                                        <div className="text-xs text-gray-500">{order.user?.phone || ''}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <CustomBadge className={getStatusColor(order.status)}>
                                                            {order.status}
                                                        </CustomBadge>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate">
                                                        {getItemsText(order)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {totalWeight} kg
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        रु {calculateTotal(order).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-4">No orders found</div>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}