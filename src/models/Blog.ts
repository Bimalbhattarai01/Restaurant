import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

type BlogDoc = HydratedDocument<{
  subHeading: string;
  heading: string;
  slug: string;
  description: string;
  image: string;
  imagePublicId?: string;
}>;

function slugify(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const BlogSchema = new Schema(
  {
    subHeading: { type: String, required: true, trim: true },
    heading: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
  },
  { timestamps: true }
);

BlogSchema.pre("validate", async function (next) {
  const doc = this as BlogDoc;
  if (!doc.isModified("heading")) return next();

  if (!doc.heading) {
    return next(new Error("Heading is required to generate slug"));
  }

  const base = slugify(doc.heading);
  let candidate = base;
  let suffix = 1;

  const BlogModel = doc.constructor as Model<BlogDoc>;

  while (await BlogModel.exists({ slug: candidate })) {
    candidate = `${base}-${suffix}`;
    suffix++;
  }

  doc.slug = candidate;
  return next();
});

export const Blog =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema, "blogs");
