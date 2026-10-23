import mongoose, { Schema, Model } from 'mongoose';

export interface IHyipProject {
  projectId: string;
  name: string;
  votes: number;
  clicks: number;
  ratingsCount: number;
  lastUpdated?: Date;
}

const HyipProjectSchema = new Schema<IHyipProject>(
  {
    projectId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    votes: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const HyipProjectModel: Model<IHyipProject> =
  (mongoose.models.HyipProject as Model<IHyipProject>) ||
  mongoose.model<IHyipProject>('HyipProject', HyipProjectSchema);
