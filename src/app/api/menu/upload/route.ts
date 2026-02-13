export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Menu } from "@/models/Menu";
import { adminUnauthorizedResponse, isAdminAuthenticated } from "@/lib/auth";
import { uploadImageBufferToCloudinary } from "@/lib/cloudinary";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return adminUnauthorizedResponse();
  }

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || "";
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const MAX_IMAGES = 4;
    const rawFiles = formData.getAll("images").filter((file): file is File => file instanceof File);

    if (rawFiles.length > MAX_IMAGES) {
      return NextResponse.json({ success: false, message: `You can upload up to ${MAX_IMAGES} images.` }, { status: 400 });
    }

    const uploadedFiles = rawFiles.slice(0, MAX_IMAGES);

    const fallbackFile = formData.get("image");
    if (uploadedFiles.length === 0 && fallbackFile instanceof File) {
      uploadedFiles.push(fallbackFile);
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json({ success: false, message: "Please upload at least one image." }, { status: 400 });
    }

    if (uploadedFiles.length > MAX_IMAGES) {
      return NextResponse.json({ success: false, message: `You can upload up to ${MAX_IMAGES} images.` }, { status: 400 });
    }

    await connectDB();

    const uploadResults = await Promise.all(
      uploadedFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return uploadImageBufferToCloudinary(buffer, "menu-items");
      })
    );

    const imagePaths = uploadResults.map((item) => item.url);
    const imagePublicIds = uploadResults.map((item) => item.publicId);

    const menu = await Menu.create({
      name,
      description,
      price,
      category,
      image: imagePaths[0] || "",
      images: imagePaths,
      imagePublicId: imagePublicIds[0] || "",
      imagePublicIds,
    });

    revalidateTag("menus");
    revalidateTag(`menu:${menu._id.toString()}`);
    revalidatePath("/menu");
    revalidatePath(`/menu/${menu._id.toString()}`);

    return NextResponse.json({ success: true, data: menu }, { status: 201 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
