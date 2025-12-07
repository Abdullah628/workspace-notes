import { Schema, model, Types } from "mongoose";

export interface CompanyDocument {
  name: string;
  domain?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<CompanyDocument>(
  {
    name: { type: String, required: true, index: true },
    domain: { type: String },
  },
  { timestamps: true }
);

CompanySchema.index({ domain: 1 }, { unique: true, sparse: true });

export const Company = model<CompanyDocument>("Company", CompanySchema);
