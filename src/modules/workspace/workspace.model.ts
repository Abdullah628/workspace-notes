import { Schema, model, Types } from "mongoose";

export interface WorkspaceDocument {
  companyId: Types.ObjectId;
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<WorkspaceDocument>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    name: { type: String, required: true, index: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

WorkspaceSchema.index({ companyId: 1, name: 1 }, { unique: true });

export const Workspace = model<WorkspaceDocument>("Workspace", WorkspaceSchema);
