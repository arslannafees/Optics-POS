"use client";

import { motion } from "framer-motion";

import React from "react";
import { BarChart3, TrendingUp, ShoppingCart, Users, DollarSign, Package, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/contexts/SettingsContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { StatCard } from "@/components/analytics/StatCard";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsPage() {
  const { settings } = useSettings();
  const { period, setPeriod, selectedYear, setSelectedYear, salesData, categoryData, topProducts, loading, availableYears, stats } = useAnalytics();
  const [activeTab, setActiveTab] = React.useState("revenue");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your business performance</p>
        </div>
        <div className="flex items-center gap-3">
          {loading && <div className="text-xs text-muted-foreground animate-pulse">Updating...</div>}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Year:</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>{availableYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Period:</span>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]"><Calendar className="mr-2 h-4 w-4" /><SelectValue placeholder="Period" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Full Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={stats.totalRevenue} icon={DollarSign} prefix={`${settings.currency} `} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
        <StatCard title="Total Customers" value={stats.totalCustomers} icon={Users} />
        <StatCard title="Avg Order Value" value={stats.avgOrderValue} icon={TrendingUp} prefix={`${settings.currency} `} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex w-full max-w-md mx-auto relative h-11 bg-muted/20">
          <ATab v="revenue" l="Revenue" active={activeTab === "revenue"} />
          <ATab v="orders" l="Orders" active={activeTab === "orders"} />
          <ATab v="categories" l="Categories" active={activeTab === "categories"} />
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-5 border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4" />Revenue Overview</CardTitle>
                <CardDescription>Revenue trends for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(val) => `${settings.currency} ${val}`} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(val) => [`${settings.currency} ${val.toLocaleString()}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Top Products</CardTitle>
                <CardDescription>Best selling items this period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topProducts.length > 0 ? topProducts.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><span className="text-sm font-medium">{index + 1}</span></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sales} sold</p>
                    </div>
                    <span className="text-sm font-medium">{settings.currency} {item.revenue.toLocaleString()}</span>
                  </div>
                )) : <div className="py-8 text-center text-sm text-muted-foreground">No sales data for this period</div>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><ShoppingCart className="h-4 w-4" />Orders Trend</CardTitle>
              <CardDescription>Order count for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(val) => [val, "Orders"]} />
                    <Bar dataKey="orders" name="Orders" fill="#3f3f46" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Package className="h-4 w-4" />Sales by Category</CardTitle>
                <CardDescription>Revenue distribution by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                        {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(val, name) => [`${val}%`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Category Breakdown</CardTitle>
                <CardDescription>Detailed category statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.length > 0 ? categoryData.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{category.count} items</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${category.value}%`, backgroundColor: COLORS[index % COLORS.length] }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground"><span>{category.value}% of total revenue</span></div>
                  </div>
                )) : <div className="py-8 text-center text-sm text-muted-foreground">No category data available</div>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const ATab = ({ v, l, active }) => (
  <TabsTrigger
    value={v}
    className="relative flex-1 z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
  >
    {active && (
      <motion.div
        layoutId="active-analytics-pill"
        className="absolute inset-0 bg-white rounded-lg shadow-sm z-[-1]"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="font-medium">{l}</span>
  </TabsTrigger>
);
