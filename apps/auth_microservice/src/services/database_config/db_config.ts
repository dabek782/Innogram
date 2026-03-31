import { error } from "console";
import mongoose, { Schema, Document, connect } from "mongoose";

export default async function connect_to_Mongo() {
  try {
    const connection = process.env.DATABASE_URL;
    await connect(connection!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(
      "Error connecting to MongoDB:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}
interface IRefreshToken extends Document {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  profileId: string | null;
  accountId: string;
}
const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: String,
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    profileId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema,
);
