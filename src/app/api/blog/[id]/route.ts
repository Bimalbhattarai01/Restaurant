import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import fs from "fs";
import path from "path";
import { adminUnauthorizedResponse, isAdminAuthenticated } from "@/lib/auth";
import { deleteCloudinaryAsset, uploadImageBufferToCloudinary } from "@/lib/cloudinary";

function removeImage(imagePath?: string | null) {
  if (!imagePath) return;
  const cleaned = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const absolute = path.join(process.cwd(), "public", cleaned);
  if (fs.existsSync(absolute)) {
    fs.unlinkSync(absolute);
  }
}

function isLocalUploadPath(imagePath?: string | null) {
  return Boolean(imagePath && imagePath.startsWith("/uploads/"));
}

async function parsePayload(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("image");
    return {
      subHeading: ((form.get("subHeading") as string) || "").trim(),
      heading: ((form.get("heading") as string) || "").trim(),
      description: ((form.get("description") as string) || "").trim(),
      imageFile: file instanceof File ? file : null,
      existingImage: ((form.get("existingImage") as string) || "").trim(),
    };
  }

  const body = await req.json();
  return {
    subHeading: (body.subHeading || "").trim(),
    heading: (body.heading || "").trim(),
    description: (body.description || "").trim(),
    imageFile: null,
    existingImage: (body.image || body.existingImage || "").trim(),
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!(await isAdminAuthenticated())) {
    return adminUnauthorizedResponse();
  }

  try {
    await connectDB();
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    const payload = await parsePayload(req);

    if (!payload.subHeading || !payload.heading || !payload.description) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    let imagePath = blog.image;
    let nextPublicId = blog.imagePublicId || "";
    let previousLocalImageToDelete: string | null = null;
    let previousCloudinaryPublicIdToDelete: string | null = null;

    if (payload.imageFile) {
      const buffer = Buffer.from(await payload.imageFile.arrayBuffer());
      const uploaded = await uploadImageBufferToCloudinary(buffer, "blog-covers");
      imagePath = uploaded.url;
      nextPublicId = uploaded.publicId;

      if (blog.imagePublicId) {
        previousCloudinaryPublicIdToDelete = blog.imagePublicId;
      } else if (isLocalUploadPath(blog.image)) {
        previousLocalImageToDelete = blog.image;
      }
    } else if (payload.existingImage) {
      if (payload.existingImage !== blog.image) {
        if (blog.imagePublicId) {
          previousCloudinaryPublicIdToDelete = blog.imagePublicId;
        } else if (isLocalUploadPath(blog.image)) {
          previousLocalImageToDelete = blog.image;
        }
      }
      imagePath = payload.existingImage;
      nextPublicId = "";
    }

    blog.subHeading = payload.subHeading;
    blog.heading = payload.heading;
    blog.description = payload.description;
    blog.image = imagePath;
    blog.imagePublicId = nextPublicId;
    await blog.save();
    revalidateTag("blogs", "max");
    revalidateTag(`blog:${id}`, "max");
    revalidatePath("/blog");

    if (previousLocalImageToDelete && previousLocalImageToDelete !== imagePath) {
      removeImage(previousLocalImageToDelete);
    }
    if (previousCloudinaryPublicIdToDelete && previousCloudinaryPublicIdToDelete !== nextPublicId) {
      await deleteCloudinaryAsset(previousCloudinaryPublicIdToDelete);
    }

    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!(await isAdminAuthenticated())) {
    return adminUnauthorizedResponse();
  }

  try {
    await connectDB();
    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    if (deleted.imagePublicId) {
      await deleteCloudinaryAsset(deleted.imagePublicId);
    } else {
      removeImage(deleted.image);
    }

    revalidateTag("blogs", "max");
    revalidateTag(`blog:${id}`, "max");
    revalidatePath("/blog");

    return NextResponse.json({ success: true, message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
