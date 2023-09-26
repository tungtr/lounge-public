// Essentials
import { Schema, model, models } from 'mongoose';

// Interfaces
import { ImageITF } from '@interfaces/ImageITF';

export interface UserMITF {
  email: string;
  username: string;
  password: string;
  avatar: ImageITF;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserMITF>(
  {
    email: { type: String, unique: true, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    avatar: { type: Schema.Types.Mixed },
    isVerified: { type: Boolean, required: true }
  },
  {
    timestamps: true
  }
);

const User = models.User || model('User', UserSchema);

export default User;