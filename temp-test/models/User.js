import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
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
}, { timestamps: true });
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
