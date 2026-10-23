import mongoose, { Schema } from 'mongoose';
const ChatMessageSchema = new Schema({
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
}, { timestamps: true });
export const ChatMessageModel = mongoose.models.ChatMessage ||
    mongoose.model('ChatMessage', ChatMessageSchema);
