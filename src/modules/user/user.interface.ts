import { Types } from "mongoose";

export enum Role {
    OWNER = "OWNER",
    MEMBER = "MEMBER"
}


export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
  _id?: Types.ObjectId
  company: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: Role;
  isActive?: IsActive;
  auths: IAuthProvider[];
  createdAt?: Date;
  updatedAt?: Date;
}