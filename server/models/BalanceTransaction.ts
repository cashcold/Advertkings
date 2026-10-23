import mongoose, { Schema, Model } from 'mongoose';

export interface IBalanceTransaction {
  userEmail: string;
  userName: string;
  type: 'admin_reload' | 'admin_withdraw' | 'withdraw' | 'aviator_bet' | 'aviator_win' | 'aviator_cancel' | 'casino_spin' | 'casino_win' | 'game_win' | 'bonus' | 'other';
  gameOrSource: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  note?: string;
  createdAt: Date;
}

const BalanceTransactionSchema = new Schema<IBalanceTransaction>(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    gameOrSource: { type: String, required: true, default: 'General' },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const BalanceTransactionModel: Model<IBalanceTransaction> =
  (mongoose.models.BalanceTransaction as Model<IBalanceTransaction>) ||
  mongoose.model<IBalanceTransaction>('BalanceTransaction', BalanceTransactionSchema);
