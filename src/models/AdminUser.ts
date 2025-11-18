import { Schema, model, models } from "mongoose";

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
  },
  { timestamps: true }
);

export const AdminUser = models.AdminUser || model("AdminUser", AdminUserSchema);
