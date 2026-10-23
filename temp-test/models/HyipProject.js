import mongoose, { Schema } from 'mongoose';
const HyipProjectSchema = new Schema({
    projectId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    votes: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });
export const HyipProjectModel = mongoose.models.HyipProject ||
    mongoose.model('HyipProject', HyipProjectSchema);
