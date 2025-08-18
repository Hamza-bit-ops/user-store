import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: [true, 'Account type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AccountSchema.index({ userId: 1, createdAt: -1 });

// Prevent duplicate model error in development with hot reloading
export default models.Account || model<IAccount>('Account', AccountSchema);