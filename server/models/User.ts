import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode?: string;
  password?: string;
  telegramHandle?: string;
  balance: number;
  currency: string;
  role: 'member' | 'vip' | 'admin';
  verified: boolean;
  avatar?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    countryCode: { type: String, default: '+1' },
    password: { type: String, required: true },
    telegramHandle: { type: String, trim: true },
    balance: { type: Number, default: 50.0 },
    currency: { type: String, default: 'USD' },
    role: { type: String, enum: ['member', 'vip', 'admin'], default: 'vip' },
    verified: { type: Boolean, default: true },
    avatar: { type: String, default: '👑' },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
