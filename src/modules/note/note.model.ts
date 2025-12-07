import { Schema, model, Types } from "mongoose";

export type NoteType = "public" | "private";

export interface NoteDocument {
  workspaceId: Types.ObjectId;
  companyId: Types.ObjectId;
  authorUserId: Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  type: NoteType;
  isDraft: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<NoteDocument>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    authorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, index: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [], index: true },
    type: { type: String, enum: ["public", "private"], default: "private", index: true },
    isDraft: { type: Boolean, default: false, index: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound indexes for common queries
NoteSchema.index({ workspaceId: 1, title: 1 });
NoteSchema.index({ type: 1, isDraft: 1, createdAt: -1 });
NoteSchema.index({ type: 1, isDraft: 1, upvotes: -1 });
NoteSchema.index({ type: 1, isDraft: 1, downvotes: -1 });

// Text index for full-text search on title (faster than regex)
NoteSchema.index({ title: "text" });

// Compound text + filter index for public notes search
NoteSchema.index({ type: 1, isDraft: 1, title: 1 });

export const Note = model<NoteDocument>("Note", NoteSchema);
