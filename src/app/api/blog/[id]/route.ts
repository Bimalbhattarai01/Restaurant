import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import fs from "fs";
import path from "path";
import { adminUnauthorizedResponse, isAdminAuthenticated } from "@/lib/auth";

const uploadDir = path.join(process.cwd(), "public/uploads");

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

async function saveImageFile(file: File | null) {
  if (!file) return null;
  ensureUploadDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  const sanitized = file.name.replace(/[^a-zA-Z0-9.\-]/g, "-");
  const fileName = `${Date.now()}-${sanitized}`;
  fs.writeFileSync(path.join(uploadDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

function removeImage(imagePath?: string | null) {
  if (!imagePath) return;
  const cleaned = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const absolute = path.join(process.cwd(), "public", cleaned);
  if (fs.existsSync(absolute)) {
    fs.unlinkSync(absolute);
  }
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
    const blog = await Blog.findById(id);
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

  if (!isAdminAuthenticated()) {
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
    let previousImageToDelete: string | null = null;

    if (payload.imageFile) {
      const saved = await saveImageFile(payload.imageFile);
      if (saved) {
        previousImageToDelete = blog.image;
        imagePath = saved;
      }
    } else if (payload.existingImage) {
      imagePath = payload.existingImage;
    }

    blog.subHeading = payload.subHeading;
    blog.heading = payload.heading;
    blog.description = payload.description;
    blog.image = imagePath;
    await blog.save();

    if (previousImageToDelete && previousImageToDelete !== imagePath) {
      removeImage(previousImageToDelete);
    }

    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!isAdminAuthenticated()) {
    return adminUnauthorizedResponse();
  }

  try {
    await connectDB();
    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    removeImage(deleted.image);

    return NextResponse.json({ success: true, message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
