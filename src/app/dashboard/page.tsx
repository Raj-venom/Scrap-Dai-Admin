import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Recycle, Scale, Truck } from "lucide-react";
import { Overview } from "@/components/overview";

const dashboardCards = [
  { title: "Total Recycled", icon: Recycle, value: "18,436 Kg", change: "+20.1% from last month" },
  { title: "Active Collectors", icon: Truck, value: "25", change: "+2 this week" },
  { title: "Today's Collections", icon: Scale, value: "89 Kg", change: "12 pickups completed" },
  { title: "Environmental Impact", icon: Leaf, value: "36 Trees", change: "230 kWh Energy Saved" },
]

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" >Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {
          dashboardCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" >{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" >{card.value}</div>
                <p className="text-xs text-muted-foreground" >{card.change}</p>
              </CardContent>
            </Card>
          ))
        }
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Collection Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Overview />
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard