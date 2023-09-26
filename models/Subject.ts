// Essentials
import { Schema, model, models } from 'mongoose';

export interface SubjectMITF {
  name: string,
  loungeCount: number
};

const SubjectSchema = new Schema<SubjectMITF>(
  {
    name: { type: String, required: true },
    loungeCount: { type: Number, required: true }
  }
);

const Subject = models.Subject || model('Subject', SubjectSchema);

export default Subject;