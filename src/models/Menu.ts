import mongoose, { Schema } from "mongoose";

const MenuSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator(value: string[]) {
          return value.length <= 4;
        },
        message: "You can upload up to 4 images per menu item.",
      },
    },
    imagePublicIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

MenuSchema.pre("save", function (next) {
  if (!this.image && Array.isArray(this.images) && this.images.length > 0) {
    this.image = this.images[0];
  }
  next();
});

MenuSchema.index({ name: 1, category: 1 }, { unique: true });

export const Menu = mongoose.models.Menu || mongoose.model("Menu", MenuSchema, "menus");
