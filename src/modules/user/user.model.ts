import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})


const userSchema = new Schema<IUser>({
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    
    role: {
        type: String,
        enum: Object.values(Role),
        required: true,
        default: Role.MEMBER,
    },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE,
    },

    auths: [authProviderSchema],
}, {
    timestamps: true,
    versionKey: false
})

userSchema.index({ company: 1, email: 1 }, { unique: true });

export const User = model<IUser>("User", userSchema)