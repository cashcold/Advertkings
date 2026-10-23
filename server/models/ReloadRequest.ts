import mongoose, { Schema, Model } from 'mongoose';

export interface IReloadRequest {
  type?: 'deposit' | 'withdraw';
  userEmail: string;
  userName: string;
  userId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  referenceId?: string;
  destinationAddress?: string;
  userNote?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  balanceBefore?: number;
  balanceAfter?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReloadRequestSchema = new Schema<IReloadRequest>(
  {
    type: { type: String, enum: ['deposit', 'withdraw'], default: 'deposit', index: true },
    userEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    userName: { type: String, required: true, trim: true },
    userId: { type: String },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'USD' },
    paymentMethod: { type: String, default: 'USDT (TRC-20)' },
    referenceId: { type: String, trim: true },
    destinationAddress: { type: String, trim: true },
    userNote: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminNote: { type: String, trim: true },
    reviewedBy: { type: String, trim: true },
    reviewedAt: { type: Date },
    balanceBefore: { type: Number },
    balanceAfter: { type: Number },
  },
  { timestamps: true }
);

export const ReloadRequestModel: Model<IReloadRequest> =
  mongoose.models.ReloadRequest || mongoose.model<IReloadRequest>('ReloadRequest', ReloadRequestSchema);
