import mongoose, { Schema } from 'mongoose';
const UserSessionSchema = new Schema({
    sessionId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 50.0 },
    currency: { type: String, default: 'GHS' },
    telegramUsername: { type: String },
    totalBets: { type: Number, default: 0 },
    totalWins: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
}, { timestamps: true });
export const UserSessionModel = mongoose.models.UserSession ||
    mongoose.model('UserSession', UserSessionSchema);
