"use client";
import React, { useState } from "react";

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        className="sr-only peer"
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-10 h-5 bg-muted rounded-full peer-checked:bg-foreground transition-colors" />
      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform" />
    </label>
  );
}

export default function VendorCreate({ onSave }) {
  const [form, setForm] = useState({
    name: "",
    title: "",
    type: "",
    destination: "",
    address: "",
    mobile: "",
    phone: "",
    email: "",
    active: true,
  });
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const required = [
    "name",
    "title",
    "type",
    "destination",
    "address",
    "mobile",
    "phone",
    "email",
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleBlur(e) {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  }

  function validate() {
    const errors = {};
    required.forEach((k) => {
      if (!String(form[k] || "").trim()) errors[k] = "Required";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Invalid email";
    return errors;
  }

  const errors = validate();

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(required.reduce((acc, k) => ((acc[k] = true), acc), {}));
    if (Object.keys(errors).length) return;
    setSaving(true);
    setMessage("");
    try {
      const payload = { ...form };
      if (typeof onSave === "function") onSave(payload);
      await new Promise((r) => setTimeout(r, 500));
      setMessage("Saved successfully");
    } catch {
      setMessage("Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  function handleReset() {
    setForm({
      name: "",
      title: "",
      type: "",
      destination: "",
      address: "",
      mobile: "",
      phone: "",
      email: "",
      active: true,
    });
    setTouched({});
    setMessage("");
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-background border rounded-md">
      <h2 className="text-lg font-semibold mb-4">Create Vendor</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              touched.name && errors.name ? "border-red-500" : "border-gray-200"
            }`}
          />
          {touched.name && errors.name && (
            <div className="text-xs text-red-500 mt-1">{errors.name}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              touched.title && errors.title
                ? "border-red-500"
                : "border-gray-200"
            }`}
          />
          {touched.title && errors.title && (
            <div className="text-xs text-red-500 mt-1">{errors.title}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              touched.type && errors.type ? "border-red-500" : "border-gray-200"
            }`}
          />
          {touched.type && errors.type && (
            <div className="text-xs text-red-500 mt-1">{errors.type}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Destination <span className="text-red-500">*</span>
          </label>
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              touched.destination && errors.destination
                ? "border-red-500"
                : "border-gray-200"
            }`}
          />
          {touched.destination && errors.destination && (
            <div className="text-xs text-red-500 mt-1">
              {errors.destination}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              touched.address && errors.address
                ? "border-red-500"
                : "border-gray-200"
            }`}
          />
          {touched.address && errors.address && (
            <div className="text-xs text-red-500 mt-1">{errors.address}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              touched.mobile && errors.mobile
                ? "border-red-500"
                : "border-gray-200"
            }`}
          />
          {touched.mobile && errors.mobile && (
            <div className="text-xs text-red-500 mt-1">{errors.mobile}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              touched.phone && errors.phone
                ? "border-red-500"
                : "border-gray-200"
            }`}
          />
          {touched.phone && errors.phone && (
            <div className="text-xs text-red-500 mt-1">{errors.phone}</div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${
              touched.email && errors.email
                ? "border-red-500"
                : "border-gray-200"
            }`}
          />
          {touched.email && errors.email && (
            <div className="text-xs text-red-500 mt-1">{errors.email}</div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Active</label>
          <Toggle
            checked={form.active}
            onChange={(val) => setForm((s) => ({ ...s, active: val }))}
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <div className="text-sm text-muted-foreground">{message}</div>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border rounded hover:bg-muted"
          >
            Reset
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className={`px-4 py-2 rounded text-background ${
              saving ? "bg-muted-foreground" : "bg-foreground hover:bg-foreground/90"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
