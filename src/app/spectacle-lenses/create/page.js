"use client";
import React, { useState } from "react";

export default function LensForm() {
  const [active, setActive] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.active = active;

  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-background border rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Create Lens</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          name="sph"
          placeholder="Sph"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          name="cyl"
          placeholder="Cyl"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="cost"
          placeholder="Cost"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="opening_balance"
          placeholder="Opening Balance"
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="remarks"
          placeholder="Remarks (Optional)"
          className="p-2 border rounded md:col-span-2"
        />

        <div className="flex items-center space-x-3 md:col-span-2">
          <label className="font-medium">Active</label>
          <button
            type="button"
            onClick={() => setActive(!active)}
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${active ? "bg-foreground" : "bg-muted"
              }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${active ? "translate-x-6" : ""
                }`}
            />
          </button>
        </div>

        <button
          type="submit"
          className="md:col-span-2 p-3 bg-foreground text-background rounded hover:bg-foreground/90"
        >
          Save
        </button>
      </form>
    </div>
  );
}
