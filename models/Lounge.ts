// Essentials
import { Schema, Types, model, models } from 'mongoose';

// Interfaces
import { ImageITF } from '@interfaces/ImageITF';

export interface LoungeMITF {
  name: string;
  subjectId: Types.ObjectId;
  description: string;
  adminId: Types.ObjectId;
  modIds: Types.ObjectId[];
  memberIds: Types.ObjectId[];

  joinCode: string;
  visibility: string;

  avatar: ImageITF;
  cover: ImageITF;
};

const LoungeSchema = new Schema<LoungeMITF>(
  {
    name: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    adminId: { type: Schema.Types.ObjectId, required: true },
    modIds: { type: Schema.Types.Mixed },
    memberIds: { type: Schema.Types.Mixed },

    joinCode: { type: String, required: true },
    visibility: { type: String, required: true },

    avatar: { type: Schema.Types.Mixed },
    cover: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true
  }
);

const Lounge = models.Lounge || model('Lounge', LoungeSchema);

export default Lounge;