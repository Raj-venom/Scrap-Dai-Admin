import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import analyticsService from "@/services/analytics.api";
import Image from "next/image";

// Types
type Seller = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  totalAmount: number;
  orderCount: number;
};

type Collector = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  totalWeight: number;
  orderCount: number;
};

export default async function PerformancePage() {
  const [sellersData, collectorsData] = await Promise.all([
    analyticsService.getTopScrapSellers(),
    analyticsService.getTopCollectors(),
  ]);


  const topSellers: Seller[] = sellersData?.data || [];
  const topCollectors: Collector[] = collectorsData?.data || [];



  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Performance Overview</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Sellers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Scrap Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Amount ($)</TableHead>
                  <TableHead>Order Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellers.map((seller) => (
                  <TableRow key={seller._id}>
                    <TableCell>
                      <Image
                        src={seller.avatar}
                        alt={seller.fullName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </TableCell>
                    <TableCell>{seller.fullName}</TableCell>
                    <TableCell>{seller.phone}</TableCell>
                    <TableCell>${seller.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{seller.orderCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Collectors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Scrap Collectors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Collected (kg)</TableHead>
                  <TableHead>Order Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCollectors.map((collector) => (
                  <TableRow key={collector._id}>
                    <TableCell>
                      <Image
                        src={collector.avatar}
                        alt={collector.fullName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </TableCell>
                    <TableCell>{collector.fullName}</TableCell>
                    <TableCell>{collector.phone}</TableCell>
                    <TableCell>{collector.totalWeight}</TableCell>
                    <TableCell>{collector.orderCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
