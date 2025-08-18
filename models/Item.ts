import { Schema, model, models } from 'mongoose';

export interface IItem {
  name: string;
  amount: string;
  description?: string;
}

const ItemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    amount: {
      type: String,
      required: [true, 'Amount is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Prevent model overwrite upon hot reload
export default models.Item || model<IItem>('Item', ItemSchema);