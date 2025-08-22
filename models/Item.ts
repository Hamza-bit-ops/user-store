    import { Schema, model, models } from 'mongoose';

    export interface IItem {
      amount: string;
      date: string;
      time: string;
    }

    const ItemSchema = new Schema<IItem>(
      {
        amount: {
          type: String,
          required: [true, 'Amount is required'],
          trim: true
        },
        date: {
          type: String,
          required: [true, 'Date is required'],
          trim: true
        },
        time: {
          type: String,
          required: [true, 'Time is required'],
          trim: true
        }
      },
      {
        timestamps: true // Adds createdAt and updatedAt automatically
      }
    );

    // Prevent model overwrite upon hot reload
    export default models.Item || model<IItem>('Item', ItemSchema);