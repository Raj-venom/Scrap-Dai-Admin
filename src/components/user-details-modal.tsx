"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import orderService from "@/services/order.api"
import userService from "@/services/user.api"

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
}


interface UserDetailsModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdate: (updatedUser: User) => void;
}

function CustomBadge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${className}`}>
            {children}
        </span>
    );
}

export function UserDetailsModal({ user, isOpen, onClose, onUserUpdate }: UserDetailsModalProps) {
    const [orderFilter, setOrderFilter] = useState("all");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [banReason, setBanReason] = useState("");
    const [showBanReasonInput, setShowBanReasonInput] = useState(false);

    useEffect(() => {
        if (user && isOpen) {
            fetchOrders(orderFilter);
        }
    }, [user, isOpen, orderFilter]);

    const fetchOrders = async (timeframe: string) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await orderService.getUserOrderHistoryById(user._id, timeframe);
            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBanToggle = async () => {
        if (!user) return;

        if (user.isBanned) {
            // Unban user flow
            const confirmationMessage = "Are you sure you want to unban this user?";
            if (!window.confirm(confirmationMessage)) return;

            const loadingToast = toast.loading("Unbanning user...");
            try {
                const response = await userService.unBanUser(user._id);
                if (response.success) {
                    toast.success("User unbanned successfully", { id: loadingToast });
                    const updatedUser = { ...user, isBanned: false, bannedReason: "" };
                    onUserUpdate(updatedUser);
                } else {
                    toast.error(response.message || "Failed to unban user", { id: loadingToast });
                }
            } catch (error) {
                toast.error("An error occurred while unbanning user", { id: loadingToast });
                console.error("Error unbanning user:", error);
            }
        } else {
            // Ban user flow - show reason input
            setShowBanReasonInput(true);
        }
    };

    const confirmBanWithReason = async () => {
        if (!user || !banReason.trim()) {
            toast.error("Please provide a reason for banning this user");
            return;
        }

        const confirmationMessage = "Are you sure you want to ban this user?";
        if (!window.confirm(confirmationMessage)) return;

        const loadingToast = toast.loading("Banning user...");
        try {
            const response = await userService.banUser(user._id, banReason);
            if (response.success) {
                toast.success("User banned successfully", { id: loadingToast });
                const updatedUser = { ...user, isBanned: true, bannedReason: banReason };
                onUserUpdate(updatedUser);
                setShowBanReasonInput(false);
                setBanReason("");
            } else {
                toast.error(response.message || "Failed to ban user", { id: loadingToast });
            }
        } catch (error) {
            toast.error("An error occurred while banning user", { id: loadingToast });
            console.error("Error banning user:", error);
        }
    };

    const cancelBanWithReason = () => {
        setShowBanReasonInput(false);
        setBanReason("");
    };

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

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>
                        View details of {user.fullName}
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
                                        src={user.avatar || "/placeholder.svg"}
                                        alt={user.fullName}
                                        width={100}
                                        height={100}
                                        className="rounded-full w-24 h-24 object-cover"
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
                                    <strong>Joined:</strong> {formatDate(user.createdAt)}
                                </p>
                                <p>
                                    <strong>Verified:</strong> {user.isverified ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Role:</strong> {user.role}
                                </p>
                                <div className="mt-4 flex flex-col gap-4">
                                    {showBanReasonInput ? (
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Enter reason for banning this user"
                                                value={banReason}
                                                onChange={(e) => setBanReason(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="destructive"
                                                    onClick={confirmBanWithReason}
                                                    className="w-fit"
                                                >
                                                    Confirm Ban
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={cancelBanWithReason}
                                                    className="w-fit"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant={user.isBanned ? "default" : "destructive"}
                                            onClick={handleBanToggle}
                                            className="w-fit"
                                        >
                                            {user.isBanned ? "Unban User" : "Ban User"}
                                        </Button>
                                    )}
                                    {user.isBanned && (
                                        <div className="text-sm">
                                            <p className="text-red-500">This user is currently banned</p>
                                            {user.bannedReason && (
                                                <p className="text-gray-600 mt-1">
                                                    <strong>Reason:</strong> {user.bannedReason}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
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
                                onValueChange={setOrderFilter}
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