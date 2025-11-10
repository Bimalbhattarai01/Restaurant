import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Menu } from "@/models/Menu";
import { adminUnauthorizedResponse, isAdminAuthenticated } from "@/lib/auth";

function isDuplicateKeyError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: number }).code === 11000;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) {
    return adminUnauthorizedResponse();
  }

  try {
    await connectDB();
    const { name, price, category, description, image } = await req.json();

    if (!name || !price || !category) {
      return NextResponse.json({ success: false, message: "Name, price, and category are required." }, { status: 400 });
    }

    const existingMenu = await Menu.findOne({
      name: { $regex: `^${name}$`, $options: "i" }, // ignore case
      category,
    });

    if (existingMenu) {
      return NextResponse.json(
        { success: false, message: "This menu already exists in the same category." },
        { status: 400 }
      );
    }

    const menu = await Menu.create({
      name,
      price,
      category,
      description,
      image,
    });

    return NextResponse.json({ success: true, data: menu }, { status: 201 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ success: false, message: "Duplicate menu entry not allowed." }, { status: 400 });
    }

    console.error("Error creating menu:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const search = searchParams.get("search") || "";

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const total = await Menu.countDocuments(query);
    const skip = (page - 1) * limit;

    const menus = await Menu.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return NextResponse.json({
      success: true,
      data: menus,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
