import "server-only";

import { Types } from "mongoose";
import { unstable_cache } from "next/cache";
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
  return unstable_cache(
    async () => {
      await connectDB();
      return Menu.countDocuments();
    },
    ["dashboard-menu-count"],
    { revalidate: 30, tags: ["menus"] }
  )();
}

export async function getBlogCount() {
  return unstable_cache(
    async () => {
      await connectDB();
      return Blog.countDocuments();
    },
    ["dashboard-blog-count"],
    { revalidate: 30, tags: ["blogs"] }
  )();
}

export async function getContactSummary() {
  return unstable_cache(
    async () => {
      await connectDB();
      const [total, unreadCount] = await Promise.all([Contact.countDocuments(), Contact.countDocuments({ isRead: false })]);
      return { total, unread: unreadCount };
    },
    ["dashboard-contact-summary"],
    { revalidate: 15, tags: ["contacts"] }
  )();
}

export async function getMenuPage(page = 1, limit = 10) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  return unstable_cache(
    async () => {
      await connectDB();
      const skip = (safePage - 1) * safeLimit;

      const [total, menus] = await Promise.all([
        Menu.countDocuments(),
        Menu.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(safeLimit)
          .select("_id name description price category image images createdAt updatedAt")
          .lean(),
      ]);

      const pagination: Pagination = {
        total,
        page: safePage,
        pages: getPages(total, safeLimit),
        limit: safeLimit,
      };

      const data = menus.map((menu) => serializeDoc(menu));
      return { data, pagination };
    },
    [`dashboard-menu-page-${safePage}-${safeLimit}`],
    { revalidate: 30, tags: ["menus"] }
  )();
}

export async function getBlogPage(page = 1, limit = 10) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  return unstable_cache(
    async () => {
      await connectDB();
      const skip = (safePage - 1) * safeLimit;

      const [total, blogs] = await Promise.all([
        Blog.countDocuments(),
        Blog.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(safeLimit)
          .select("_id subHeading heading slug description image imagePublicId createdAt updatedAt")
          .lean(),
      ]);

      const pagination: Pagination = {
        total,
        page: safePage,
        pages: getPages(total, safeLimit),
        limit: safeLimit,
      };

      const data = blogs.map((blog) => serializeDoc(blog));
      return { data, pagination };
    },
    [`dashboard-blog-page-${safePage}-${safeLimit}`],
    { revalidate: 30, tags: ["blogs"] }
  )();
}

export async function getContactPage(page = 1, limit = 10) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit));
  return unstable_cache(
    async () => {
      await connectDB();
      const skip = (safePage - 1) * safeLimit;

      const [contacts, total, unreadCount] = await Promise.all([
        Contact.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(safeLimit)
          .select("_id name email phone subject reservationDate reservationTime message isRead createdAt updatedAt")
          .lean(),
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
    },
    [`dashboard-contact-page-${safePage}-${safeLimit}`],
    { revalidate: 15, tags: ["contacts"] }
  )();
}

export async function getMenuById(id?: string) {
  if (!id || id === "undefined" || !Types.ObjectId.isValid(id)) return null;
  return unstable_cache(
    async () => {
      await connectDB();
      const menu = await Menu.findById(id)
        .select("_id name price category description image images createdAt updatedAt")
        .lean();
      if (!menu) return null;
      return serializeDoc(menu as { _id: unknown; createdAt?: Date; updatedAt?: Date } & Record<string, unknown>);
    },
    [`dashboard-menu-by-id-${id}`],
    { revalidate: 60, tags: ["menus", `menu:${id}`] }
  )();
}

export async function getBlogById(id?: string) {
  if (!id || id === "undefined" || !Types.ObjectId.isValid(id)) return null;
  return unstable_cache(
    async () => {
      await connectDB();
      const blog = await Blog.findById(id)
        .select("_id subHeading heading slug description image imagePublicId createdAt updatedAt")
        .lean();
      if (!blog) return null;
      return serializeDoc(blog as { _id: unknown; createdAt?: Date; updatedAt?: Date } & Record<string, unknown>);
    },
    [`dashboard-blog-by-id-${id}`],
    { revalidate: 60, tags: ["blogs", `blog:${id}`] }
  )();
}
