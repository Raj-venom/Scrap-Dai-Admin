import Link from "next/link";
import { Home, Users, Tag, Package, DollarSign, BarChart, UserCircle } from "lucide-react"
import { AdminProfile } from "./admin-profile";


const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Collectors", href: "/dashboard/collectors", icon: Users },
    { name: "Users", href: "/dashboard/users", icon: UserCircle },
    { name: "Categories", href: "/dashboard/categories", icon: Tag },
    { name: "Scrap Items", href: "/dashboard/items", icon: Package },
    { name: "Pricing", href: "/dashboard/pricing", icon: DollarSign },
    { name: "Performance", href: "/dashboard/performance", icon: BarChart },
]

export function Sidebar() {
    return (
        <div className="flex flex-col w-64 bg-white shadow-md h-screen">
            <div className="p-6 bg-primary">
                <h1 className="text-2xl font-bold text-white" >Scrap Dai Admin</h1>
            </div>
            <nav className="flex-1 mt-6">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-6 py-3 text-textcolor-400 hover:bg-thersery transition-colors"
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="border-t">
                <AdminProfile />
            </div>
        </div>
    )
}