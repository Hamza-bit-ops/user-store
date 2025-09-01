import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ITransaction extends Document {
  type: "credit" | "debit";
  amount: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Index for faster queries by date
TransactionSchema.index({ date: -1 });

// Prevent duplicate model error in dev
export default models.Transaction ||
  model<ITransaction>("Transaction", TransactionSchema);
