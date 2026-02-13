import "server-only";

import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Menu } from "@/models/Menu";
import { Blog } from "@/models/Blog";
import { Contact } from "@/models/Contact";

type Pagination = {
  total: number;
  page: number;
  pages: number;
  limit: number;
};

type WithTimestamps = {
  createdAt?: Date;
  updatedAt?: Date;
};

type Serialized<T> = Omit<T, "_id" | "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

function getPages(total: number, limit: number) {
  return Math.max(1, Math.ceil(total / limit));
}

function serializeDoc<T extends { _id: unknown } & Partial<WithTimestamps>>(doc: T): Serialized<T> {
  const { createdAt, updatedAt, ...rest } = doc;
  return {
    ...(rest as Omit<T, "_id" | "createdAt" | "updatedAt">),
    _id: typeof doc._id === "string" ? doc._id : String(doc._id),
    createdAt: createdAt ? createdAt.toISOString() : undefined,
    updatedAt: updatedAt ? updatedAt.toISOString() : undefined,
  };
}

export async function getMenuCount() {
  await connectDB();
  return Menu.countDocuments();
}

export async function getBlogCount() {
  await connectDB();
  return Blog.countDocuments();
}

export async function getContactSummary() {
  await connectDB();
  const [total, unreadCount] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ isRead: false }),
  ]);

  return { total, unread: unreadCount };
}

export async function getMenuPage(page = 1, limit = 10) {
  await connectDB();
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const skip = (safePage - 1) * safeLimit;

  const [total, menus] = await Promise.all([
    Menu.countDocuments(),
    Menu.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
  ]);

  const pagination: Pagination = {
    total,
    page: safePage,
    pages: getPages(total, safeLimit),
    limit: safeLimit,
  };

  const data = menus.map((menu) => serializeDoc(menu));
  return { data, pagination };
}

export async function getBlogPage(page = 1, limit = 10) {
  await connectDB();
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const skip = (safePage - 1) * safeLimit;

  const [total, blogs] = await Promise.all([
    Blog.countDocuments(),
    Blog.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
  ]);

  const pagination: Pagination = {
    total,
    page: safePage,
    pages: getPages(total, safeLimit),
    limit: safeLimit,
  };

  const data = blogs.map((blog) => serializeDoc(blog));
  return { data, pagination };
}

export async function getContactPage(page = 1, limit = 10) {
  await connectDB();
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit));
  const skip = (safePage - 1) * safeLimit;

  const [contacts, total, unreadCount] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    Contact.countDocuments(),
    Contact.countDocuments({ isRead: false }),
  ]);

  const pagination: Pagination = {
    total,
    page: safePage,
    pages: getPages(total, safeLimit),
    limit: safeLimit,
  };

  const data = contacts.map((contact) => ({
    ...serializeDoc(contact),
    reservationDate: contact.reservationDate ? contact.reservationDate.toISOString() : undefined,
  }));

  return {
    data,
    pagination,
    summary: { total, unreadCount },
  };
}

export async function getMenuById(id?: string) {
  if (!id || id === "undefined" || !Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const menu = await Menu.findById(id).lean();
  if (!menu) return null;
  return serializeDoc(
    menu as { _id: unknown; createdAt?: Date; updatedAt?: Date } & Record<string, unknown>
  );
}

export async function getBlogById(id?: string) {
  if (!id || id === "undefined" || !Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const blog = await Blog.findById(id).lean();
  if (!blog) return null;
  return serializeDoc(
    blog as { _id: unknown; createdAt?: Date; updatedAt?: Date } & Record<string, unknown>
  );
}
