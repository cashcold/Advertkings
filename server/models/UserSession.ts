import mongoose, { Schema, Model } from 'mongoose';

export interface IUserSession {
  sessionId: string;
  balance: number;
  currency: string;
  telegramUsername?: string;
  totalBets: number;
  totalWins: number;
  lastActive?: Date;
}

const UserSessionSchema = new Schema<IUserSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 50.0 },
    currency: { type: String, default: 'GHS' },
    telegramUsername: { type: String },
    totalBets: { type: Number, default: 0 },
    totalWins: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UserSessionModel: Model<IUserSession> =
  (mongoose.models.UserSession as Model<IUserSession>) ||
  mongoose.model<IUserSession>('UserSession', UserSessionSchema);
