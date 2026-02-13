import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { adminUnauthorizedResponse, isAdminAuthenticated } from "@/lib/auth";
import { uploadImageBufferToCloudinary } from "@/lib/cloudinary";

type ParsedPayload = {
  subHeading: string;
  heading: string;
  description: string;
  imageFile: File | null;
  existingImage: string;
};

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
  if (!(await isAdminAuthenticated())) {
    return adminUnauthorizedResponse();
  }

  try {
    const payload = await parsePayload(req);

    if (!payload.subHeading || !payload.heading || !payload.description) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    let imagePath = payload.existingImage;
    let imagePublicId = "";

    if (payload.imageFile) {
      const buffer = Buffer.from(await payload.imageFile.arrayBuffer());
      const uploaded = await uploadImageBufferToCloudinary(buffer, "blog-covers");
      imagePath = uploaded.url;
      imagePublicId = uploaded.publicId;
    }

    if (!imagePath) {
      return NextResponse.json({ success: false, message: "Cover image is required." }, { status: 400 });
    }

    await connectDB();
    const blog = await Blog.create({
      subHeading: payload.subHeading,
      heading: payload.heading,
      description: payload.description,
      image: imagePath,
      imagePublicId,
    });

    revalidateTag("blogs");
    revalidateTag(`blog:${blog._id.toString()}`);
    revalidatePath("/blog");

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
    const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
    const parsedLimit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 50) : 10;
    const search = (searchParams.get("search") || "").trim();
    const hasSearch = search.length > 0;
    const query = hasSearch ? { $text: { $search: search } } : {};

    const skip = (page - 1) * limit;
    const [total, blogs] = await Promise.all([
      Blog.countDocuments(query),
      hasSearch
        ? Blog.find(query, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" }, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("_id subHeading heading slug description image imagePublicId createdAt updatedAt")
            .lean()
        : Blog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("_id subHeading heading slug description image imagePublicId createdAt updatedAt")
            .lean(),
    ]);

    const response = NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
      },
    });
    response.headers.set(
      "Cache-Control",
      hasSearch ? "public, s-maxage=20, stale-while-revalidate=60" : "public, s-maxage=60, stale-while-revalidate=300"
    );
    return response;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
