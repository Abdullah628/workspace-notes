import { Schema, model, Types } from "mongoose";

export type VoteType = "up" | "down";

export interface VoteDocument {
  noteId: Types.ObjectId;
  voterUserId?: Types.ObjectId;
  voterCompanyId?: Types.ObjectId;
  type: VoteType;
  createdAt: Date;
}

const VoteSchema = new Schema<VoteDocument>(
  {
    noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true, index: true },
    voterUserId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    voterCompanyId: { type: Schema.Types.ObjectId, ref: "Company", index: true },
    type: { type: String, enum: ["up", "down"], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

VoteSchema.index({ noteId: 1, voterUserId: 1 }, { unique: true, sparse: true });
VoteSchema.index({ noteId: 1, voterCompanyId: 1 }, { unique: true, sparse: true });

export const Vote = model<VoteDocument>("Vote", VoteSchema);
