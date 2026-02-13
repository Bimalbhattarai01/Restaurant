import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Menu } from "@/models/Menu";
import { adminUnauthorizedResponse, isAdminAuthenticated } from "@/lib/auth";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

type MenuPayload = {
  name: string;
  price: number;
  category: string;
  description: string;
  imageFile: File | null;
  existingImage: string;
};

async function parsePayload(req: Request): Promise<MenuPayload> {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const image = formData.get("image");
    const priceValue = Number(formData.get("price"));

    return {
      name: String(formData.get("name") || "").trim(),
      price: Number.isFinite(priceValue) ? priceValue : NaN,
      category: String(formData.get("category") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      imageFile: image instanceof File ? image : null,
      existingImage: String(formData.get("existingImage") || "").trim(),
    };
  }

  const body = await req.json();
  const parsedPrice = Number(body.price);
  return {
    name: String(body.name || "").trim(),
    price: Number.isFinite(parsedPrice) ? parsedPrice : NaN,
    category: String(body.category || "").trim(),
    description: String(body.description || "").trim(),
    imageFile: null,
    existingImage: String(body.image || body.existingImage || "").trim(),
  };
}

/**
 * GET MENU  (GET /api/menu/:id)
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await connectDB();
    const menu = await Menu.findById(id).lean();

    if (!menu) {
      return NextResponse.json({ success: false, message: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: menu }, { status: 200 });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

/**
 * UPDATE MENU  (PUT /api/menu/:id)
 */
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // unwrap params (Next.js 15+)

  if (!(await isAdminAuthenticated())) {
    return adminUnauthorizedResponse();
  }

  try {
    await connectDB();
    const payload = await parsePayload(req);

    if (!payload.name || !Number.isFinite(payload.price) || !payload.category) {
      return NextResponse.json({ success: false, message: "Name, price, and category are required." }, { status: 400 });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return NextResponse.json({ success: false, message: "Menu not found" }, { status: 404 });
    }

    let nextImage = menu.image || "";
    let nextImages = Array.isArray(menu.images) && menu.images.length > 0 ? menu.images : nextImage ? [nextImage] : [];
    let nextImagePublicId = menu.imagePublicId || "";
    let nextImagePublicIds = Array.isArray(menu.imagePublicIds) ? menu.imagePublicIds.filter(Boolean) : [];
    const previousPublicIds = new Set<string>();
    if (menu.imagePublicId) previousPublicIds.add(menu.imagePublicId);
    for (const publicId of menu.imagePublicIds || []) {
      if (publicId) previousPublicIds.add(publicId);
    }

    if (payload.imageFile) {
      const { uploadImageBufferToCloudinary, deleteCloudinaryAsset } = await import("@/lib/cloudinary");
      const buffer = Buffer.from(await payload.imageFile.arrayBuffer());
      const uploaded = await uploadImageBufferToCloudinary(buffer, "menu-items");
      nextImage = uploaded.url;
      nextImages = [uploaded.url];
      nextImagePublicId = uploaded.publicId;
      nextImagePublicIds = [uploaded.publicId];

      const staleIds = Array.from(previousPublicIds).filter((publicId) => publicId !== uploaded.publicId);
      if (staleIds.length > 0) {
        await Promise.all(staleIds.map((publicId) => deleteCloudinaryAsset(publicId)));
      }
    } else if (payload.existingImage && payload.existingImage !== menu.image) {
      nextImage = payload.existingImage;
      nextImages = [payload.existingImage];
    }

    menu.name = payload.name;
    menu.price = payload.price;
    menu.category = payload.category;
    menu.description = payload.description;
    menu.image = nextImage;
    menu.images = nextImages.slice(0, 4);
    menu.imagePublicId = nextImagePublicId;
    menu.imagePublicIds = nextImagePublicIds.slice(0, 4);
    const updated = await menu.save();

    revalidateTag("menus", "max");
    revalidateTag(`menu:${id}`, "max");
    revalidatePath("/menu");
    revalidatePath(`/menu/${id}`);

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

/**
 * DELETE MENU  (DELETE /api/menu/:id)
 */
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // unwrap params (Next.js 15+)

  if (!(await isAdminAuthenticated())) {
    return adminUnauthorizedResponse();
  }

  try {
    await connectDB();
    const { deleteCloudinaryAsset } = await import("@/lib/cloudinary");

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
    revalidateTag("menus", "max");
    revalidateTag(`menu:${id}`, "max");
    revalidatePath("/menu");
    revalidatePath(`/menu/${id}`);

    return NextResponse.json({ success: true, message: "Menu deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting menu:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
