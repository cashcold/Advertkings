import mongoose, { Schema } from 'mongoose';
const AviatorRoundSchema = new Schema({
    roundId: { type: String, required: true, unique: true },
    crashMultiplier: { type: Number, required: true },
    betsCount: { type: Number, default: 0 },
    totalWon: { type: Number, default: 0 },
}, { timestamps: true });
export const AviatorRoundModel = mongoose.models.AviatorRound ||
    mongoose.model('AviatorRound', AviatorRoundSchema);
