import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Menu } from "@/models/Menu";
import mongoose from "mongoose";
import { adminUnauthorizedResponse, isAdminAuthenticated } from "@/lib/auth";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

/**
 * ✅ GET MENU  (GET /api/menu/:id)
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await connectDB();
    const menu = await Menu.findById(id);

    if (!menu) {
      return NextResponse.json({ success: false, message: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: menu }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching menu:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

/**
 * ✅ UPDATE MENU  (PUT /api/menu/:id)
 */
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // unwrap params (Next.js 15+)

  if (!(await isAdminAuthenticated())) {
    return adminUnauthorizedResponse();
  }

  try {
    await connectDB();

    console.log("🆔 PUT request for ID:", id);
    console.log("📦 Connected to DB:", mongoose.connection.name);

    const body = await req.json();

    const updated = await Menu.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating menu:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

/**
 * ✅ DELETE MENU  (DELETE /api/menu/:id)
 */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // unwrap params (Next.js 15+)

  if (!(await isAdminAuthenticated())) {
    return adminUnauthorizedResponse();
  }

  try {
    await connectDB();

    console.log("🆔 DELETE request for ID:", id);
    console.log("📦 Connected to DB:", mongoose.connection.name);

    const menu = await Menu.findById(id);
    if (!menu) {
      return NextResponse.json({ success: false, message: "Menu not found" }, { status: 404 });
    }

    const assetIds = new Set<string>();
    if (menu.imagePublicId) assetIds.add(menu.imagePublicId);
    if (Array.isArray(menu.imagePublicIds)) {
      for (const id of menu.imagePublicIds) {
        if (id) assetIds.add(id);
      }
    }

    if (assetIds.size > 0) {
      await Promise.all(Array.from(assetIds).map((publicId) => deleteCloudinaryAsset(publicId)));
    }

    await menu.deleteOne();

    return NextResponse.json({ success: true, message: "Menu deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting menu:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
