import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
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
  if (!(await isAdminAuthenticated())) {
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

    revalidateTag("menus");
    revalidatePath("/menu");

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
    const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
    const parsedLimit = Number.parseInt(searchParams.get("limit") || "5", 10);
    const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 50) : 5;
    const search = (searchParams.get("search") || "").trim();
    const hasSearch = search.length > 0;
    const query = hasSearch ? { $text: { $search: search } } : {};

    const skip = (page - 1) * limit;
    const [total, menus] = await Promise.all([
      Menu.countDocuments(query),
      hasSearch
        ? Menu.find(query, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" }, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("_id name description price category image images createdAt updatedAt")
            .lean()
        : Menu.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("_id name description price category image images createdAt updatedAt")
            .lean(),
    ]);

    const response = NextResponse.json({
      success: true,
      data: menus,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
    response.headers.set(
      "Cache-Control",
      hasSearch ? "public, s-maxage=20, stale-while-revalidate=60" : "public, s-maxage=60, stale-while-revalidate=300"
    );
    return response;
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
