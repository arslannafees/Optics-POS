"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Pencil,
  Trash2,
  Tag,
  Glasses,
  Eye,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import ContactLensIcon from "@/components/ContactLensIcon";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useBranch } from "@/contexts/BranchContext"; // Added import

const initialFormState = {
  brand: "",
  type: "All Categories",
  remarks: "",
  active: true,
};

export default function BrandsPage() {
  const { currentShop, currentBranch, loading: branchLoading } = useBranch();
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!branchLoading && currentShop) {
      loadBrands();
    }
  }, [currentShop, currentBranch, branchLoading]);

  const loadBrands = async () => {
    if (!currentShop) return;
    setIsLoading(true);
    try {
      let url = `/api/brands?shopId=${currentShop.id}`;
      if (currentBranch) url += `&branchId=${currentBranch.id}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      } else {
        toast.error("Failed to load brands");
      }
    } catch (error) {
      console.error("Error loading brands:", error);
      toast.error("Failed to load brands");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.type) {
      toast.error("Please fill in required fields");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      if (isEditing && selectedBrand) {
        const response = await fetch(`/api/brands/${selectedBrand.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, user: { id: user.id, name: user.name, role: user.role } }),
        });

        if (response.ok) {
          const updatedBrand = await response.json();
          setBrands((prev) =>
            prev.map((b) => (b.id === selectedBrand.id ? updatedBrand : b))
          );
          toast.success("Brand updated successfully");
        } else {
          const error = await response.json();
          toast.error(error.error || "Failed to update brand");
        }
      } else {
        const payload = { ...form, branchId: currentBranch?.id, shopId: currentShop?.id, user: { id: user.id, name: user.name, role: user.role } };
        const response = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const newBrand = await response.json();
          setBrands((prev) => [newBrand, ...prev]);
          toast.success("Brand added successfully");
        } else {
          const error = await response.json();
          toast.error(error.error || "Failed to add brand");
        }
      }
      resetForm();
      setSheetOpen(false);
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setForm({
      brand: brand.brand || "",
      type: brand.type || "All Categories",
      remarks: brand.remarks || "",
      active: brand.active ?? true,
    });
    setIsEditing(true);
    setSheetOpen(true);
  };

  const handleDelete = (brand) => {
    setSelectedBrand(brand);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBrand) return;

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(`/api/brands/${selectedBrand.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { id: user.id, name: user.name, role: user.role } }),
      });

      if (res.ok) {
        setBrands((prev) => prev.filter((b) => b.id !== selectedBrand.id));
        toast.success("Brand deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedBrand(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete brand");
    }
  };

  const toggleActive = async (brand) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const updatedStatus = !brand.active;
      const response = await fetch(`/api/brands/${brand.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...brand, active: updatedStatus, user: { id: user.id, name: user.name, role: user.role } }),
      });

      if (response.ok) {
        const updatedBrand = await response.json();
        setBrands((prev) =>
          prev.map((b) => (b.id === brand.id ? updatedBrand : b))
        );
        toast.success(`Brand ${updatedStatus ? "activated" : "deactivated"}`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setIsEditing(false);
    setSelectedBrand(null);
  };

  const openNewSheet = () => {
    resetForm();
    setSheetOpen(true);
  };

  const spectacleLensBrands = brands.filter((b) => b.type === "Spectacle Lens" || b.type === "Lens" || b.type === "All Categories").length;
  const contactLensBrands = brands.filter((b) => b.type === "Contact Lens" || b.type === "All Categories").length;
  const frameBrands = brands.filter((b) => b.type === "Frame" || b.type === "All Categories").length;
  const accessoryBrands = brands.filter((b) => b.type === "Accessory" || b.type === "All Categories").length;
  const activeBrands = brands.filter((b) => b.active).length;

  const columns = [
    {
      accessorKey: "brand",
      header: "Brand Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{row.original.brand}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge variant="outline">
            {type === "Frame" ? (
              <Glasses className="mr-1 h-3 w-3" />
            ) : type === "Contact Lens" ? (
              <ContactLensIcon className="mr-1 h-3.5 w-3.5" />
            ) : type === "Spectacle Lens" || type === "Lens" ? (
              <Eye className="mr-1 h-3 w-3" />
            ) : type === "All Categories" ? (
              <LayoutGrid className="mr-1 h-3 w-3" />
            ) : (
              <Sparkles className="mr-1 h-3 w-3" />
            )}
            {type === "Lens" ? "Spectacle Lens" : type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: ({ row }) => (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {row.original.remarks || "-"}
        </span>
      ),
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.original.active}
            onCheckedChange={() => toggleActive(row.original)}
          />
          <span className="text-sm text-muted-foreground">
            {row.original.active ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row.original)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brands</h1>
          <p className="text-sm text-muted-foreground">
            Manage your frame, spectacle and contact lens brands
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadBrands}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={openNewSheet}>
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Brands
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{brands.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeBrands} active
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Frame Brands
            </CardTitle>
            <Glasses className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{frameBrands}</div>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Spectacle Lens Brands
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{spectacleLensBrands}</div>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contact Lens Brands
            </CardTitle>
            <ContactLensIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{contactLensBrands}</div>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Accessory Brands
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{accessoryBrands}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Brand List</CardTitle>
          <CardDescription>
            A list of all brands in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={brands}
            searchPlaceholder="Search brands..."
            isLoading={isLoading}
            emptyMessage="No brands found. Add your first brand to get started."
          />
        </CardContent>
      </Card>

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Edit Brand" : "Add New Brand"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update the brand information below"
                : "Fill in the details to add a new brand"}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6 px-10 pb-6">
            <div className="space-y-2">
              <Label htmlFor="brand">
                Brand Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                placeholder="Enter brand name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">
                Brand Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom">
                  <SelectItem value="All Categories">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4" />
                      All Categories
                    </div>
                  </SelectItem>
                  <SelectItem value="Frame">
                    <div className="flex items-center gap-2">
                      <Glasses className="h-4 w-4" />
                      Frame
                    </div>
                  </SelectItem>
                  <SelectItem value="Spectacle Lens">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Spectacle Lens
                    </div>
                  </SelectItem>
                  <SelectItem value="Contact Lens">
                    <div className="flex items-center gap-2">
                      <ContactLensIcon className="h-4 w-4" />
                      Contact Lens
                    </div>
                  </SelectItem>
                  <SelectItem value="Accessory">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Accessory
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={form.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                placeholder="Enter any remarks"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active Status</Label>
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(checked) => handleChange("active", checked)}
              />
            </div>
            <SheetFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update" : "Add Brand"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedBrand?.brand}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
