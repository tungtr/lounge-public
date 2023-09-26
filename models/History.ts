// Essentials
import { Schema, Types, model, models } from 'mongoose';

export interface HistoryMITF {
  userId: Types.ObjectId;
  visitedLoungeIds: string[];
};

const HistorySchema = new Schema<HistoryMITF>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    visitedLoungeIds: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true
  }
);

const History = models.History || model('History', HistorySchema);

export default History;