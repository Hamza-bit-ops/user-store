import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  number: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    number: {
      type: String,
      required: [true, 'Please provide a number'],
      unique: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
  },
  {
    timestamps: true,
  }
);

// Add virtual for accounts
UserSchema.virtual('accounts', {
  ref: 'Account',
  localField: '_id',
  foreignField: 'userId',
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Prevent duplicate model error in development with hot reloading
export default models.User || model<IUser>('User', UserSchema);