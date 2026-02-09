"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Eye,
  Glasses,
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import ContactLensIcon from "@/components/ContactLensIcon";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import NoData from "@/components/NoData";
import { useSettings } from "@/contexts/SettingsContext";
import { useBranch } from "@/contexts/BranchContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function StockInHandPage() {
  const { settings } = useSettings();
  const { currentShop } = useBranch();
  const lowStockThreshold = parseInt(settings.lowStockThreshold || "5");

  const [frames, setFrames] = useState([]);
  const [lenses, setLenses] = useState([]);
  const [contactLenses, setContactLenses] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("frames");

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch data when shop changes
  useEffect(() => {
    if (currentShop) {
      fetchData();
    }
  }, [currentShop]);

  const fetchData = async () => {
    try {
      if (!currentShop) return;

      setLoading(true);
      const shopId = currentShop.id;
      const branchId = "All"; // Always show all branches for the shop

      const [framesRes, lensesRes, contactLensesRes, accessoriesRes] = await Promise.all([
        fetch(`/api/frames?shopId=${shopId}&branchId=${branchId}&t=${Date.now()}`),
        fetch(`/api/spectacle-lenses?shopId=${shopId}&branchId=${branchId}&t=${Date.now()}`),
        fetch(`/api/contact-lenses?shopId=${shopId}&branchId=${branchId}&t=${Date.now()}`),
        fetch(`/api/accessories?shopId=${shopId}&branchId=${branchId}&t=${Date.now()}`),
      ]);

      if (framesRes.ok) {
        const data = await framesRes.json();
        setFrames(data);
      }
      if (lensesRes.ok) {
        const data = await lensesRes.json();
        setLenses(data);
      }
      if (contactLensesRes.ok) {
        const data = await contactLensesRes.json();
        setContactLenses(data);
      }
      if (accessoriesRes.ok) {
        const data = await accessoriesRes.json();
        setAccessories(data);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success("Stock data refreshed");
  };

  const handleRowClick = (item, type) => {
    setSelectedItem({ ...item, itemType: type });
    setIsDetailsOpen(true);
  };

  const getStockBadge = (stock) => {
    return (
      <Badge variant="outline">
        {stock === 0
          ? "Out of Stock"
          : stock <= lowStockThreshold
            ? "Low Stock"
            : "In Stock"}
      </Badge>
    );
  };

  // Frame columns
  const frameColumns = [
    {
      accessorKey: "brand",
      header: "Frame Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Glasses className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.getValue("brand")}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "branchName",
      header: "Branch",
      cell: ({ row }) => <Badge variant="secondary">{row.getValue("branchName") || "Main Branch"}</Badge>,
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => row.getValue("model") || "-",
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => row.getValue("color") || "-",
    },
    {
      accessorKey: "material",
      header: "Material",
      cell: ({ row }) => row.getValue("material") || "-",
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row }) => {
        const cost = parseFloat(row.getValue("cost")) || 0;
        return <span className="text-muted-foreground">{settings.currency} {cost.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price")) || 0;
        return <span className="font-medium">{settings.currency} {price.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") || 0;
        return (
          <span className="font-medium">{stock}</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Stock Status",
      cell: ({ row }) => {
        const stock = row.getValue("stock") || 0;
        return getStockBadge(stock);
      },
    },
    {
      accessorKey: "stockValue",
      header: "Stock Value",
      cell: ({ row }) => {
        const price = parseFloat(row.original.price) || 0;
        const stock = row.original.stock || 0;
        return <span>{settings.currency} {(price * stock).toLocaleString()}</span>;
      },
    },
  ];

  // Lens columns
  const lensColumns = [
    {
      accessorKey: "name",
      header: "Spectacle lens Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.brand || "No brand"}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "branchName",
      header: "Branch",
      cell: ({ row }) => <Badge variant="secondary">{row.getValue("branchName") || "Main Branch"}</Badge>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type");
        if (!type) return "-";
        return (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "material",
      header: "Material",
      cell: ({ row }) => row.getValue("material") || "-",
    },
    {
      accessorKey: "coating",
      header: "Coating",
      cell: ({ row }) => row.getValue("coating") || "-",
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row }) => {
        const cost = parseFloat(row.getValue("cost")) || 0;
        return <span className="text-muted-foreground">{settings.currency} {cost.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price")) || 0;
        return <span className="font-medium">{settings.currency} {price.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") || 0;
        return (
          <span className="font-medium">{stock}</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Stock Status",
      cell: ({ row }) => {
        const stock = row.getValue("stock") || 0;
        return getStockBadge(stock);
      },
    },
    {
      accessorKey: "stockValue",
      header: "Stock Value",
      cell: ({ row }) => {
        const price = parseFloat(row.original.price) || 0;
        const stock = row.original.stock || 0;
        return <span>{settings.currency} {(price * stock).toLocaleString()}</span>;
      },
    },
  ];

  // Contact Lens columns
  const contactLensColumns = [
    {
      accessorKey: "name",
      header: "Contact Lens Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ContactLensIcon className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.brand || "No brand"} • {row.original.type || "No type"}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "branchName",
      header: "Branch",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue("branchName") || "Main Branch"}
        </Badge>
      ),
    },
    {
      accessorKey: "power",
      header: "Power (SPH/CYL/AXIS)",
      cell: ({ row }) => {
        const { sph, cyl, axis } = row.original;
        if (!sph && !cyl && !axis) return "-";
        return (
          <div className="text-sm">
            {sph || "0.00"} / {cyl || "0.00"} / {axis || "0"}
          </div>
        );
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry",
      cell: ({ row }) => {
        const date = row.getValue("expiryDate");
        if (!date) return "-";
        return <span className="text-sm">{new Date(date).toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row }) => {
        const cost = parseFloat(row.getValue("cost")) || 0;
        return (
          <span className="text-muted-foreground">
            {settings.currency} {cost.toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price")) || 0;
        return (
          <span className="font-medium">
            {settings.currency} {price.toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") || 0;
        return <span className="font-medium">{stock}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Stock Status",
      cell: ({ row }) => {
        const stock = row.getValue("stock") || 0;
        return getStockBadge(stock);
      },
    },
    {
      accessorKey: "stockValue",
      header: "Stock Value",
      cell: ({ row }) => {
        const price = parseFloat(row.original.price) || 0;
        const stock = row.original.stock || 0;
        return (
          <span>
            {settings.currency} {(price * stock).toLocaleString()}
          </span>
        );
      },
    },
  ];

  // Accessory columns
  const accessoryColumns = [
    {
      accessorKey: "name",
      header: "Accessory Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.brand || "No brand"}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "branchName",
      header: "Branch",
      cell: ({ row }) => <Badge variant="secondary">{row.getValue("branchName") || "Main Branch"}</Badge>,
    },
    {
      accessorKey: "accessory_type",
      header: "Type",
      cell: ({ row }) => row.getValue("accessory_type") || "-",
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row }) => {
        const cost = parseFloat(row.getValue("cost")) || 0;
        return <span className="text-muted-foreground">{settings.currency} {cost.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price")) || 0;
        return <span className="font-medium">{settings.currency} {price.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") || 0;
        return (
          <span className="font-medium">{stock}</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Stock Status",
      cell: ({ row }) => {
        const stock = row.getValue("stock") || 0;
        return getStockBadge(stock);
      },
    },
    {
      accessorKey: "stockValue",
      header: "Stock Value",
      cell: ({ row }) => {
        const price = parseFloat(row.original.price) || 0;
        const stock = row.original.stock || 0;
        return <span>{settings.currency} {(price * stock).toLocaleString()}</span>;
      },
    },
  ];

  // Calculate stats
  const totalFrames = frames.reduce((sum, f) => sum + (f.stock || 0), 0);
  const totalLenses = lenses.reduce((sum, l) => sum + (l.stock || 0), 0);
  const totalContactLenses = contactLenses.reduce((sum, c) => sum + (c.stock || 0), 0);
  const totalAccessories = accessories.reduce((sum, a) => sum + (a.stock || 0), 0);
  const frameValue = frames.reduce(
    (sum, f) => sum + (f.price || 0) * (f.stock || 0),
    0
  );
  const lensValue = lenses.reduce(
    (sum, l) => sum + (l.price || 0) * (l.stock || 0),
    0
  );
  const contactLensValue = contactLenses.reduce(
    (sum, c) => sum + (c.price || 0) * (c.stock || 0),
    0
  );
  const accessoryValue = accessories.reduce(
    (sum, a) => sum + (a.price || 0) * (a.stock || 0),
    0
  );
  const lowStockItems =
    frames.filter((f) => f.stock > 0 && f.stock <= lowStockThreshold).length +
    lenses.filter((l) => l.stock > 0 && l.stock <= lowStockThreshold).length +
    contactLenses.filter((c) => c.stock > 0 && c.stock <= lowStockThreshold).length +
    accessories.filter((a) => a.stock > 0 && a.stock <= lowStockThreshold).length;
  const outOfStockItems =
    frames.filter((f) => f.stock === 0).length +
    lenses.filter((l) => l.stock === 0).length +
    contactLenses.filter((c) => c.stock === 0).length +
    accessories.filter((a) => a.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stock In Hand</h1>
          <p className="text-sm text-muted-foreground">
            Complete inventory overview of frames and spectacle lenses
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>Total Frames</CardDescription>
            <CardTitle className="text-2xl font-semibold">{totalFrames}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">across {frames.length} varieties</p>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>Total Spectacle lenses</CardDescription>
            <CardTitle className="text-2xl font-semibold">{totalLenses}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">across {lenses.length} varieties</p>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>Total Contact Lenses</CardDescription>
            <CardTitle className="text-2xl font-semibold">{totalContactLenses}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">across {contactLenses.length} varieties</p>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>Total Accessories</CardDescription>
            <CardTitle className="text-2xl font-semibold">{totalAccessories}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">across {accessories.length} varieties</p>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>Stock Value</CardDescription>
            <CardTitle className="text-2xl font-semibold">{settings.currency} {(frameValue + lensValue + contactLensValue + accessoryValue).toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">at selling price</p>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <CardDescription>Stock Alerts</CardDescription>
            <CardTitle className="text-2xl font-semibold">{lowStockItems + outOfStockItems}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{lowStockItems} low, {outOfStockItems} out</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Tables */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="relative">
          <STab
            v="frames"
            i={<Glasses className="h-4 w-4" />}
            l={`Frames (${frames.length})`}
            active={activeTab === "frames"}
          />
          <STab
            v="lenses"
            i={<Eye className="h-4 w-4" />}
            l={`Spectacle lenses (${lenses.length})`}
            active={activeTab === "lenses"}
          />
          <STab
            v="contact-lenses"
            i={<ContactLensIcon className="h-4 w-4" />}
            l={`Contact Lenses (${contactLenses.length})`}
            active={activeTab === "contact-lenses"}
          />
          <STab
            v="accessories"
            i={<Sparkles className="h-4 w-4" />}
            l={`Accessories (${accessories.length})`}
            active={activeTab === "accessories"}
          />
          <STab
            v="alerts"
            i={<AlertTriangle className="h-4 w-4" />}
            l={`Alerts (${lowStockItems + outOfStockItems})`}
            active={activeTab === "alerts"}
          />
        </TabsList>

        <TabsContent value="frames">
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Frame Inventory</CardTitle>
              <CardDescription>
                Total value: {settings.currency} {frameValue.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={frameColumns}
                data={frames}
                searchPlaceholder="Search frames..."
                loading={loading}
                onRowClick={(item) => handleRowClick(item, "frame")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lenses">
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Spectacle lens Inventory</CardTitle>
              <CardDescription>
                Total value: {settings.currency} {lensValue.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={lensColumns}
                data={lenses}
                searchPlaceholder="Search spectacle lenses..."
                loading={loading}
                onRowClick={(item) => handleRowClick(item, "lens")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact-lenses">
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Contact Lens Inventory</CardTitle>
              <CardDescription>
                Total value: {settings.currency} {contactLensValue.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={contactLensColumns}
                data={contactLenses}
                searchPlaceholder="Search contact lenses..."
                loading={loading}
                onRowClick={(item) => handleRowClick(item, "contact-lens")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessories">
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Accessory Inventory</CardTitle>
              <CardDescription>
                Total value: {settings.currency} {accessoryValue.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={accessoryColumns}
                data={accessories}
                searchPlaceholder="Search accessories..."
                loading={loading}
                onRowClick={(item) => handleRowClick(item, "accessory")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-4">
            {/* Low Stock Items */}
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Low Stock Items</CardTitle>
                <CardDescription>
                  Items with stock between 1 and {lowStockThreshold} units
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {frames
                    .filter((f) => f.stock > 0 && f.stock <= lowStockThreshold)
                    .map((frame) => (
                      <div
                        key={`frame-${frame.id}`}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Glasses className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{frame.name || `${frame.brand} ${frame.model}`}</p>
                            <p className="text-sm text-muted-foreground">
                              Frame • {frame.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {frame.stock} left
                        </Badge>
                      </div>
                    ))}
                  {lenses
                    .filter((l) => l.stock > 0 && l.stock <= lowStockThreshold)
                    .map((lens) => (
                      <div
                        key={`lens-${lens.id}`}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{lens.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Lens • {lens.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{lens.stock} left</Badge>
                      </div>
                    ))}
                  {contactLenses
                    .filter((c) => c.stock > 0 && c.stock <= lowStockThreshold)
                    .map((cl) => (
                      <div
                        key={`cl-${cl.id}`}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <ContactLensIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{cl.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Contact Lens • {cl.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{cl.stock} left</Badge>
                      </div>
                    ))}
                  {accessories
                    .filter((a) => a.stock > 0 && a.stock <= lowStockThreshold)
                    .map((acc) => (
                      <div
                        key={`acc-${acc.id}`}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{acc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Accessory • {acc.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{acc.stock} left</Badge>
                      </div>
                    ))}
                  {lowStockItems === 0 && (
                    <NoData message="No low stock items" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Out of Stock Items */}
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Out of Stock Items</CardTitle>
                <CardDescription>
                  Items with zero stock that need restocking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {frames
                    .filter((f) => f.stock === 0)
                    .map((frame) => (
                      <div
                        key={`frame-${frame.id}`}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Glasses className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{frame.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Frame • {frame.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Out of Stock</Badge>
                      </div>
                    ))}
                  {lenses
                    .filter((l) => l.stock === 0)
                    .map((lens) => (
                      <div
                        key={`lens-${lens.id}`}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{lens.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Lens • {lens.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Out of Stock</Badge>
                      </div>
                    ))}
                  {contactLenses
                    .filter((c) => c.stock === 0)
                    .map((cl) => (
                      <div
                        key={`cl-${cl.id}`}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{cl.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Contact Lens • {cl.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Out of Stock</Badge>
                      </div>
                    ))}
                  {accessories
                    .filter((a) => a.stock === 0)
                    .map((acc) => (
                      <div
                        key={`acc-${acc.id}`}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{acc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Accessory • {acc.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Out of Stock</Badge>
                      </div>
                    ))}
                  {outOfStockItems === 0 && (
                    <NoData message="No out of stock items" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <StockItemDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        item={selectedItem}
        allData={
          selectedItem?.itemType === "frame" ? frames :
            selectedItem?.itemType === "lens" ? lenses :
              selectedItem?.itemType === "contact-lens" ? contactLenses :
                accessories
        }
      />
    </div>
  );
}

function StockItemDetailsModal({ isOpen, onClose, item, allData = [] }) {
  if (!item) return null;

  // Find other items with same brand/name but different color
  const variations = allData.filter(v => {
    if (v.id === item.id) return false;

    if (item.itemType === "frame") {
      return v.brand === item.brand && v.model === item.model && v.id !== item.id;
    } else if (item.itemType === "contact-lens") {
      return v.brand === item.brand && v.name === item.name && v.id !== item.id;
    } else if (item.itemType === "accessory") {
      return v.name === item.name && v.id !== item.id;
    }
    return false;
  });

  const DetailRow = ({ label, value, fullWidth = false }) => {
    if (value === undefined || value === null || value === "") return null;
    return (
      <div className={fullWidth ? "col-span-2 space-y-1" : "space-y-1"}>
        <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="bg-muted/30 px-6 py-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {item.itemType === "frame" && <Glasses className="h-6 w-6" />}
              {item.itemType === "lens" && <Eye className="h-6 w-6" />}
              {item.itemType === "contact-lens" && <ContactLensIcon className="h-6 w-6" />}
              {item.itemType === "accessory" && <Sparkles className="h-6 w-6" />}
            </div>
            <div>
              <DialogTitle className="text-xl">
                {item.name || `${item.brand} ${item.model}` || "Item Details"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                Full inventory details for this item
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Base Info */}
            <DetailRow label="Brand / Vendor" value={item.brand} />
            <DetailRow label="Branch" value={item.branchName || "Main Branch"} />

            {/* Type Specific Info */}
            {item.itemType === "frame" && (
              <>
                <DetailRow label="Model" value={item.model} />
                <DetailRow label="Color" value={item.color} />
                <DetailRow label="Size" value={item.size} />
                <DetailRow label="Shape" value={item.shape} />
                <DetailRow label="Material" value={item.material} />
                <DetailRow label="Barcode" value={item.barcode} />
              </>
            )}

            {item.itemType === "lens" && (
              <>
                <DetailRow label="Lens Type" value={item.type} />
                <DetailRow label="Material" value={item.material} />
                <DetailRow label="Coating" value={item.coating} />
              </>
            )}

            {item.itemType === "contact-lens" && (
              <>
                <DetailRow label="Type" value={item.type} />
                <DetailRow label="Lens Power (SPH/CYL/AXIS)" value={`${item.sph || "0.00"} / ${item.cyl || "0.00"} / ${item.axis || "0"}`} />
                <DetailRow label="Add Power" value={item.addPower} />
                <DetailRow label="Dominance" value={item.dominance} />
                <DetailRow label="Base Curve" value={item.baseCurve} />
                <DetailRow label="Diameter" value={item.diameter} />
                <DetailRow label="Water Content" value={item.waterContent} />
                <DetailRow label="Material" value={item.material} />
                <DetailRow label="Color" value={item.color} />
                <DetailRow label="Replacement Schedule" value={item.replacementSchedule} />
                <DetailRow label="Eye Side" value={item.eyeSide} />
                <DetailRow label="Expiry Date" value={item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : null} />
                <DetailRow label="UV Protection" value={item.uvProtection ? "Yes" : "No"} />
                <DetailRow label="Oxygen Permeability" value={item.oxygenPermeability} />
              </>
            )}

            {item.itemType === "accessory" && (
              <>
                <DetailRow label="Accessory Type" value={item.accessory_type} />
              </>
            )}

            {/* Common Financial / Stock Info */}
            <div className="col-span-2 my-2 h-[1px] bg-border" />

            <DetailRow label="Cost Price" value={item.cost ? `${item.cost.toLocaleString()}` : "0"} />
            <DetailRow label="Selling Price" value={item.price ? `${item.price.toLocaleString()}` : "0"} />
            <DetailRow label="Stock Count" value={item.stock !== undefined ? item.stock.toString() : "0"} />
            <DetailRow label="Opening Balance" value={item.openingBalance} />
            <DetailRow label="Last Updated" value={item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : null)} />
            <DetailRow label="Active Status" value={item.active ? "Active" : "Inactive"} />

            <DetailRow label="Remarks" value={item.remarks} fullWidth />

            {/* Other Available Colors Section */}
            {variations.length > 0 && (
              <div className="col-span-2 mt-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  Other Available Colors for this Model
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {variations.map((v) => (
                    <div key={v.id} className="flex items-center justify-between rounded-xl border bg-muted/20 p-3 hover:bg-muted/40 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{v.color || "Generic"}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{v.branchName || "Main Branch"}</span>
                      </div>
                      <Badge variant={v.stock > 0 ? "secondary" : "outline"} className="font-mono">
                        Stock: {v.stock}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const STab = ({ v, i, l, active }) => (
  <TabsTrigger
    value={v}
    className="relative gap-2 px-4 py-2 z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
  >
    {active && (
      <motion.div
        layoutId="active-pill-stock"
        className="absolute inset-0 bg-white rounded-lg shadow-sm z-[-1]"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    {i}
    <span className="font-medium">{l}</span>
  </TabsTrigger>
);
