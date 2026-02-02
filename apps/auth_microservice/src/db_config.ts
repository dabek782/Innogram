import mongoose, { Schema, Document, connect } from "mongoose";

export default async function connect_to_Mongo() {
  const connection = process.env.DATABASE_URL;
  if (!connection) {
    throw console.error("Something went wrong");
  }
  await connect(String(connection));
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
  },
  { timestamps: true },
);

export const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema,
);
