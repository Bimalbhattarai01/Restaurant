import mongoose, { Schema } from "mongoose";

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      default: "",
      trim: true,
    },
    reservationDate: {
      type: Date,
    },
    reservationTime: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ name: "text", email: "text", subject: "text", message: "text" });

export const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema, "contacts");
