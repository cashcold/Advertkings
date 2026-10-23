import mongoose, { Schema, Model } from 'mongoose';

export interface IOrder {
  orderType: 'paypal_reload' | 'virtual_card' | 'gift_card' | 'crypto_loan' | 'general';
  userEmail?: string;
  userPhone?: string;
  telegramHandle?: string;
  amount: number;
  feeAmount: number;
  feePercentage: number;
  totalPayable: number;
  currency: string;
  paymentMethod: string;
  depositAsset?: string;
  depositNetwork?: string;
  depositAddress?: string;
  targetDetails?: {
    paypalEmail?: string;
    cardHolder?: string;
    cardNetwork?: string;
    brandName?: string;
    promoCode?: string;
    storeTarget?: string;
    loanDurationDays?: number;
    collateralAsset?: string;
  };
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  transactionHash?: string;
  ipAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderType: {
      type: String,
      required: true,
      enum: ['paypal_reload', 'virtual_card', 'gift_card', 'crypto_loan', 'general'],
      default: 'general',
    },
    userEmail: { type: String, trim: true, lowercase: true },
    userPhone: { type: String, trim: true },
    telegramHandle: { type: String, trim: true },
    amount: { type: Number, required: true },
    feeAmount: { type: Number, required: true, default: 0 },
    feePercentage: { type: Number, default: 0 },
    totalPayable: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentMethod: { type: String, default: 'crypto' },
    depositAsset: { type: String },
    depositNetwork: { type: String },
    depositAddress: { type: String },
    targetDetails: {
      paypalEmail: { type: String },
      cardHolder: { type: String },
      cardNetwork: { type: String },
      brandName: { type: String },
      promoCode: { type: String },
      storeTarget: { type: String },
      loanDurationDays: { type: Number },
      collateralAsset: { type: String },
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    transactionHash: { type: String, trim: true },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const OrderModel: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
