"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  Phone,
  Mail,
  MapPin,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { useBranch } from "@/contexts/BranchContext";

const initialFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  mobile: "",
  email: "",
  address: "",
};

export default function CustomerPage() {
  const { currentShop, currentBranch, loading: contextLoading } = useBranch();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentShop) {
      loadCustomers();
    }
  }, [currentShop]);

  const loadCustomers = async () => {
    if (!currentShop) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/customers?shopId=${currentShop.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        toast.error("Failed to load customers");
      }
    } catch (error) {
      console.error("Error loading customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.mobile.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      if (isEditing && selectedCustomer) {
        // Update customer
        const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            branchId: currentBranch?.id || user.branchId || null,
            user: { id: user.id, name: user.name, role: user.role, branchId: user.branchId }
          }),
        });

        if (res.ok) {
          const updatedCustomer = await res.json();
          setCustomers((prev) =>
            prev.map((c) => (c.id === selectedCustomer.id ? updatedCustomer : c))
          );
          toast.success("Customer updated successfully");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to update customer");
        }
      } else {
        // Create new customer
        const res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            shopId: currentShop?.id,
            branchId: currentBranch?.id || user.branchId || null,
            user: { id: user.id, name: user.name, role: user.role, branchId: user.branchId }
          }),
        });

        if (res.ok) {
          const newCustomer = await res.json();
          setCustomers((prev) => [newCustomer, ...prev]);
          toast.success("Customer added successfully");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to create customer");
        }
      }
      resetForm();
      setSheetOpen(false);
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setForm({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      phone: customer.phone || "",
      mobile: customer.mobile || "",
      email: customer.email || "",
      address: customer.address || "",
    });
    setIsEditing(true);
    setSheetOpen(true);
  };

  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: currentBranch?.id || user.branchId || null,
          user: { id: user.id, name: user.name, role: user.role, branchId: user.branchId }
        }),
      });

      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
        toast.success("Customer deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedCustomer(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setIsEditing(false);
    setSelectedCustomer(null);
  };

  const openNewSheet = () => {
    resetForm();
    setSheetOpen(true);
  };

  const columns = [
    {
      accessorKey: "localId",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          #{String(row.original.localId || row.original.id).padStart(4, "0")}
        </span>
      ),
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {row.original.firstName?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <span className="font-medium">{row.original.firstName}</span>
        </div>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.mobile || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate max-w-[200px]">
            {row.original.email || "-"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 max-w-[200px]">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{row.original.address || "-"}</span>
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
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage your customer database
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadCustomers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={openNewSheet}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              With Email
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {customers.filter((c) => c.email).length}
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              With Address
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {customers.filter((c) => c.address).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            A list of all customers in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={customers}
            searchPlaceholder="Search customers..."
            isLoading={isLoading}
            emptyMessage="No customers found. Add your first customer to get started."
          />
        </CardContent>
      </Card>

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-[500px] w-full flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Edit Customer" : "Add New Customer"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update the customer information below"
                : "Fill in the details to add a new customer"}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-hidden -mr-6 pr-6">
            <ScrollArea className="h-full">
              <form onSubmit={handleSubmit} className="space-y-4 mt-6 px-10 pb-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">
                    Mobile <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address"
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
                    {isEditing ? "Update" : "Add Customer"}
                  </Button>
                </SheetFooter>
              </form>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedCustomer?.firstName} {selectedCustomer?.lastName}
              </span>
              ? This action cannot be undone.
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
