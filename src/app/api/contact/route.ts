import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Contact } from "@/models/Contact";
import { adminUnauthorizedResponse, isAdminAuthenticated } from "@/lib/auth";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, subject, reservationDate, reservationTime, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, message: "Name, email, phone, and message are required." }, { status: 400 });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      reservationDate: reservationDate ? new Date(reservationDate) : undefined,
      reservationTime,
      message,
    });

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const search = searchParams.get("search")?.trim();
    const summaryOnly = searchParams.get("summary") === "true";

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const totalPromise = Contact.countDocuments(query);
    const unreadCountPromise = Contact.countDocuments({ isRead: false });

    if (summaryOnly) {
      const [total, unreadCount] = await Promise.all([totalPromise, unreadCountPromise]);
      return NextResponse.json({ success: true, summary: { total, unreadCount } });
    }

    const skip = (page - 1) * limit;
    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const [total, unreadCount] = await Promise.all([totalPromise, unreadCountPromise]);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      summary: { total, unreadCount },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return adminUnauthorizedResponse();
  }

  try {
    await connectDB();
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: "No contact ids provided." }, { status: 400 });
    }

    await Contact.updateMany({ _id: { $in: ids } }, { $set: { isRead: true } });
    const unreadCount = await Contact.countDocuments({ isRead: false });

    return NextResponse.json({ success: true, summary: { unreadCount } });
  } catch (error) {
    console.error("Error updating contacts:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
