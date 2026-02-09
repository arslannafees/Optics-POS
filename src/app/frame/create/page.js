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

export default function BrandForm({ onSave }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    size: "",
    color: "",
    frame_shape: "",
    cost: "",
    price: "",
    barcode: "",
    branch: "",
    opening_balance: "",
    remarks: "",
    active: true,
  });

  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const requiredFields = [
    "brand",
    "model",
    "size",
    "color",
    "frame_shape",
    "cost",
    "price",
    "barcode",
    "branch",
    "opening_balance",
  ];

  function validate() {
    const errors = {};
    requiredFields.forEach((key) => {
      if (!String(form[key]).trim()) errors[key] = "This field is required";
    });

    // optional: numeric checks
    if (form.size && isNaN(Number(form.size))) errors.size = "Must be a number";
    if (form.cost && isNaN(Number(form.cost))) errors.cost = "Must be a number";
    if (form.price && isNaN(Number(form.price)))
      errors.price = "Must be a number";
    if (
      form.opening_balance &&
      (isNaN(Number(form.opening_balance)) || Number(form.opening_balance) < 0)
    )
      errors.opening_balance = "Must be a non-negative number";

    return errors;
  }

  const errors = validate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(
      requiredFields.reduce((acc, k) => {
        acc[k] = true;
        return acc;
      }, {})
    );

    const errs = validate();
    if (Object.keys(errs).length) return;

    setSaving(true);
    setSavedMessage("");

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const payload = {
        ...form,
        // normalize numeric fields
        size: form.size, // Keep as string or number? API handles nulls, let's just pass what we have, API parses floats/ints
        shape: form.frame_shape,
        cost: Number(form.cost),
        price: Number(form.price),
        // Map frontend opening_balance to API openingBalance
        openingBalance: Number(form.opening_balance),
        // Ensure stock is initialized if not present (using opening balance as initial stock if reasonable, or 0)
        stock: Number(form.opening_balance) || 0,
        user: { id: user.id, name: user.name, role: user.role }
      };

      const res = await fetch("/api/frames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      // call parent callback if provided
      const newFrame = await res.json();
      if (typeof onSave === "function") onSave(newFrame);

      setSavedMessage("Saved successfully");

      // Reset form
      setForm({
        brand: "",
        model: "",
        size: "",
        color: "",
        frame_shape: "",
        cost: "",
        price: "",
        barcode: "",
        branch: "",
        opening_balance: "",
        remarks: "",
        active: true,
      });
      setTouched({});
    } catch (err) {
      console.error(err);
      setSavedMessage(err.message || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMessage(""), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${touched.brand && errors.brand
              ? "border-red-500"
              : "border-gray-200"
              }`}
          />
          {touched.brand && errors.brand && (
            <p className="text-xs text-red-500 mt-1">{errors.brand}</p>
          )}
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Model <span className="text-red-500">*</span>
          </label>
          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${touched.model && errors.model
              ? "border-red-500"
              : "border-gray-200"
              }`}
          />
          {touched.model && errors.model && (
            <p className="text-xs text-red-500 mt-1">{errors.model}</p>
          )}
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Size <span className="text-red-500">*</span>
          </label>
          <input
            name="size"
            type="number"
            value={form.size}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${touched.size && errors.size ? "border-red-500" : "border-gray-200"
              }`}
          />
          {touched.size && errors.size && (
            <p className="text-xs text-red-500 mt-1">{errors.size}</p>
          )}
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Color <span className="text-red-500">*</span>
          </label>
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${touched.color && errors.color
              ? "border-red-500"
              : "border-gray-200"
              }`}
          />
          {touched.color && errors.color && (
            <p className="text-xs text-red-500 mt-1">{errors.color}</p>
          )}
        </div>

        {/* Frame Shape */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Frame Shape <span className="text-red-500">*</span>
          </label>
          <select
            name="frame_shape"
            value={form.frame_shape}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${touched.frame_shape && errors.frame_shape
              ? "border-red-500"
              : "border-gray-200"
              }`}
          >
            <option value="">Select Shape</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Square">Square</option>
            <option value="Round (Circle)">Round (Circle)</option>
            <option value="Oval">Oval</option>
            <option value="Aviator (Pilot)">Aviator (Pilot)</option>
            <option value="Cat-Eye">Cat-Eye</option>
            <option value="Wayfarer (Trapezoid)">Wayfarer (Trapezoid)</option>
            <option value="Panto">Panto</option>
            <option value="Browline (Clubmaster)">Browline (Clubmaster)</option>
            <option value="Butterfly">Butterfly</option>
            <option value="Hexagon">Hexagon</option>
            <option value="Octagon">Octagon</option>
            <option value="Polygon">Polygon</option>
            <option value="Shield (Mask)">Shield (Mask)</option>
            <option value="Almond">Almond</option>
            <option value="Boston">Boston</option>
            <option value="Wellington">Wellington</option>
            <option value="D-Frame">D-Frame</option>
            <option value="Teardrop">Teardrop</option>
            <option value="Heart Shape">Heart Shape</option>
            <option value="Bug-Eye">Bug-Eye</option>
            <option value="Geometric">Geometric</option>
            <option value="Oversized">Oversized</option>
          </select>
          {touched.frame_shape && errors.frame_shape && (
            <p className="text-xs text-red-500 mt-1">{errors.frame_shape}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">
            Cost <span className="text-red-500">*</span>
          </label>
          <input
            name="cost"
            type="number"
            value={form.cost}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${touched.cost && errors.cost ? "border-red-500" : "border-gray-200"
              }`}
          />
          {touched.cost && errors.cost && (
            <p className="text-xs text-red-500 mt-1">{errors.cost}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${touched.price && errors.price
              ? "border-red-500"
              : "border-gray-200"
              }`}
          />
          {touched.price && errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Barcode <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 p-2 border rounded ${touched.barcode && errors.barcode
                ? "border-red-500"
                : "border-gray-200"
                }`}
            />
            <button
              type="button"
              onClick={() =>
                setForm((s) => ({
                  ...s,
                  barcode: String(
                    Math.floor(100000000000 + Math.random() * 900000000000)
                  ),
                }))
              }
              className="px-3 rounded bg-gray-100 hover:bg-gray-200"
            >
              Generate
            </button>
          </div>
          {touched.barcode && errors.barcode && (
            <p className="text-xs text-red-500 mt-1">{errors.barcode}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Branch <span className="text-red-500">*</span>
          </label>
          <input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${touched.branch && errors.branch
              ? "border-red-500"
              : "border-gray-200"
              }`}
          />
          {touched.branch && errors.branch && (
            <p className="text-xs text-red-500 mt-1">{errors.branch}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Opening Balance <span className="text-red-500">*</span>
          </label>
          <input
            name="opening_balance"
            type="number"
            value={form.opening_balance}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded ${touched.opening_balance && errors.opening_balance
              ? "border-red-500"
              : "border-gray-200"
              }`}
          />
          {touched.opening_balance && errors.opening_balance && (
            <p className="text-xs text-red-500 mt-1">
              {errors.opening_balance}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Remarks (optional)
          </label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="w-full p-2 border rounded resize-y border-gray-200"
            rows={3}
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3 md:col-span-1">
          <label className="block text-sm font-medium">Active</label>
          <Toggle
            checked={form.active}
            onChange={(val) => setForm((s) => ({ ...s, active: val }))}
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">{savedMessage}</div>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => {
                // reset form
                setForm({
                  brand: "",
                  model: "",
                  size: "",
                  color: "",
                  frame_shape: "",
                  cost: "",
                  price: "",
                  barcode: "",
                  branch: "",
                  opening_balance: "",
                  remarks: "",
                  active: true,
                });
                setTouched({});
                setSavedMessage("");
              }}
              className="px-4 py-2 border rounded hover:bg-muted"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded text-background ${saving ? "bg-muted-foreground" : "bg-foreground hover:bg-foreground/90"
                }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
