// Essentials
import { Schema, Types, model, models } from 'mongoose';

// Interfaces
import { ImageITF } from '@interfaces/ImageITF';
import { ReactionITF } from '@interfaces/MessageITF';

export interface MessageITF {
  loungeId: Types.ObjectId;
  order: number;
  userId: Types.ObjectId;
  content: string;
  image: ImageITF | null;
  gifKey: string | null;
  replyId: Types.ObjectId | null;
  reactions: ReactionITF[];
  createdAt: Date;
  updatedAt: Date;
};

const MessageSchema = new Schema<MessageITF>(
  {
    loungeId: { type: Schema.Types.ObjectId, required: true },
    order: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    content: { type: String },
    image: { type: Schema.Types.Mixed },
    gifKey: { type: Schema.Types.Mixed },
    replyId: { type: Schema.Types.Mixed },
    reactions: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true
  }
);

const Message = models.Message || model('Message', MessageSchema);

export default Message;