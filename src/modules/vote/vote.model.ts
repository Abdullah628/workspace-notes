import { Schema, model, Types } from "mongoose";

export type VoteType = "up" | "down";

export interface VoteDocument {
  noteId: Types.ObjectId;
  voterUserId: Types.ObjectId;
  type: VoteType;
  createdAt: Date;
}

const VoteSchema = new Schema<VoteDocument>(
  {
    noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true, index: true },
    voterUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["up", "down"], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// One vote per user per note (individual voting)
VoteSchema.index({ noteId: 1, voterUserId: 1 }, { unique: true });

export const Vote = model<VoteDocument>("Vote", VoteSchema);
