import mongoose, { Schema } from 'mongoose';
const BalanceTransactionSchema = new Schema({
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    gameOrSource: { type: String, required: true, default: 'General' },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
export const BalanceTransactionModel = mongoose.models.BalanceTransaction ||
    mongoose.model('BalanceTransaction', BalanceTransactionSchema);
