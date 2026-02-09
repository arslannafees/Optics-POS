import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const db = getDb();

        // Check if branch exists
        const branch = db.prepare("SELECT * FROM branches WHERE id = ?").get(id);
        if (!branch) {
            return NextResponse.json({ error: "Shop/Branch not found" }, { status: 404 });
        }


        db.prepare("DELETE FROM branches WHERE id = ?").run(id);

        return NextResponse.json({ message: "Shop/Branch deleted successfully" });
    } catch (error) {
        console.error("Error deleting shop/branch:", error);
        return NextResponse.json({ error: "Failed to delete shop/branch" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const { name, address, phone, active } = await req.json();

        const db = getDb();

        if (active !== undefined) {
            db.prepare("UPDATE branches SET active = ? WHERE id = ?").run(active, id);
        } else {
            db.prepare("UPDATE branches SET name = ?, address = ?, phone = ? WHERE id = ?").run(name, address || "", phone || "", id);
        }

        return NextResponse.json({ message: "Shop/Branch updated successfully" });
    } catch (error) {
        console.error("Error updating shop/branch:", error);
        return NextResponse.json({ error: "Failed to update shop/branch" }, { status: 500 });
    }
}
