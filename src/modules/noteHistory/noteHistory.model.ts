import { Schema, model, Types } from "mongoose";

export interface NoteHistoryDocument {
  noteId: Types.ObjectId;
  previousContent: string;
  previousTitle?: string;
  changedByUserId: Types.ObjectId;
  createdAt: Date;
}

const NoteHistorySchema = new Schema<NoteHistoryDocument>(
  {
    noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true, index: true },
    previousContent: { type: String, required: true },
    previousTitle: { type: String },
    changedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NoteHistorySchema.index({ noteId: 1, createdAt: -1 });

export const NoteHistory = model<NoteHistoryDocument>("NoteHistory", NoteHistorySchema);
