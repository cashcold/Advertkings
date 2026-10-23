import mongoose, { Schema, Model } from 'mongoose';

export interface IAviatorRound {
  roundId: string;
  crashMultiplier: number;
  betsCount: number;
  totalWon: number;
  createdAt?: Date;
}

const AviatorRoundSchema = new Schema<IAviatorRound>(
  {
    roundId: { type: String, required: true, unique: true },
    crashMultiplier: { type: Number, required: true },
    betsCount: { type: Number, default: 0 },
    totalWon: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const AviatorRoundModel: Model<IAviatorRound> =
  (mongoose.models.AviatorRound as Model<IAviatorRound>) ||
  mongoose.model<IAviatorRound>('AviatorRound', AviatorRoundSchema);
