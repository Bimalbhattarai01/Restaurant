import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import fs from "fs";
import path from "path";
import { adminUnauthorizedResponse, isAdminAuthenticated } from "@/lib/auth";

type ParsedPayload = {
  subHeading: string;
  heading: string;
  description: string;
  imageFile: File | null;
  existingImage: string;
};

const uploadDir = path.join(process.cwd(), "public/uploads");

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

async function saveImageFile(file: File | null) {
  if (!file) return null;
  ensureUploadDir();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const sanitized = file.name.replace(/[^a-zA-Z0-9.\-]/g, "-");
  const fileName = `${Date.now()}-${sanitized}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${fileName}`;
}

async function parsePayload(req: Request): Promise<ParsedPayload> {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const possibleFile = form.get("image");
    return {
      subHeading: ((form.get("subHeading") as string) || "").trim(),
      heading: ((form.get("heading") as string) || "").trim(),
      description: ((form.get("description") as string) || "").trim(),
      imageFile: possibleFile instanceof File ? possibleFile : null,
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

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) {
    return adminUnauthorizedResponse();
  }

  try {
    const payload = await parsePayload(req);

    if (!payload.subHeading || !payload.heading || !payload.description) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    const imagePath = payload.imageFile ? await saveImageFile(payload.imageFile) : payload.existingImage;

    if (!imagePath) {
      return NextResponse.json({ success: false, message: "Cover image is required." }, { status: 400 });
    }

    await connectDB();
    const blog = await Blog.create({
      subHeading: payload.subHeading,
      heading: payload.heading,
      description: payload.description,
      image: imagePath,
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const query = search
      ? {
          heading: { $regex: search, $options: "i" },
        }
      : {};

    const skip = (page - 1) * limit;
    const [total, blogs] = await Promise.all([
      Blog.countDocuments(query),
      Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
