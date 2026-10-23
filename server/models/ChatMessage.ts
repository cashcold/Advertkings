import mongoose, { Schema, Model } from 'mongoose';

export interface IChatMessage {
  username: string;
  category: string;
  avatar: string;
  country: string;
  verified: boolean;
  projectOrGame: string;
  payoutAmount: string;
  status: string;
  message: string;
  timestamp: string;
  badge: string;
  createdAt?: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    username: { type: String, required: true },
    category: { type: String, default: 'hyip' },
    avatar: { type: String, default: '💰' },
    country: { type: String, default: '🌍 INT' },
    verified: { type: Boolean, default: true },
    projectOrGame: { type: String, required: true },
    payoutAmount: { type: String, required: true },
    status: { type: String, default: 'PAID' },
    message: { type: String, required: true },
    timestamp: { type: String, default: 'Just now' },
    badge: { type: String, default: '💎 VIP CLAIM' },
  },
  { timestamps: true }
);

export const ChatMessageModel: Model<IChatMessage> =
  (mongoose.models.ChatMessage as Model<IChatMessage>) ||
  mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
