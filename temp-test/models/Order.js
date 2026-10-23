import mongoose, { Schema } from 'mongoose';
const OrderSchema = new Schema({
    orderType: {
        type: String,
        required: true,
        enum: ['paypal_reload', 'virtual_card', 'gift_card', 'crypto_loan', 'general'],
        default: 'general',
    },
    userEmail: { type: String, trim: true, lowercase: true },
    userPhone: { type: String, trim: true },
    telegramHandle: { type: String, trim: true },
    amount: { type: Number, required: true },
    feeAmount: { type: Number, required: true, default: 0 },
    feePercentage: { type: Number, default: 0 },
    totalPayable: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentMethod: { type: String, default: 'crypto' },
    depositAsset: { type: String },
    depositNetwork: { type: String },
    depositAddress: { type: String },
    targetDetails: {
        paypalEmail: { type: String },
        cardHolder: { type: String },
        cardNetwork: { type: String },
        brandName: { type: String },
        promoCode: { type: String },
        storeTarget: { type: String },
        loanDurationDays: { type: Number },
        collateralAsset: { type: String },
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING',
    },
    transactionHash: { type: String, trim: true },
    ipAddress: { type: String },
}, { timestamps: true });
export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
