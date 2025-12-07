import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import { User } from "../user/user.model";
import { IAuthProvider, IUser } from "../user/user.interface";
import { hashPassword, verifyPassword } from "../../utils/hash";
import { Company } from "../company/company.model";

const register = async (payload: {
  companyName?: string;
  name: string;
  email: string;
  password: string;
}) => {
  const { companyName, name, email, password } = payload;

  // Check if user with this email already exists globally
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User with this email already exists"
    );
  }

  // Extract email domain
  const emailDomain = email.split("@")[1];

  // Try to find existing company by domain
  let company = await Company.findOne({ domain: emailDomain });
  let role: "OWNER" | "MEMBER" = "MEMBER";

  if (!company) {
    // No company exists with this domain - create new one (user becomes OWNER)
    if (!companyName) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Company name is required for first registration with this email domain"
      );
    }

    company = await Company.create({
      name: companyName,
      domain: emailDomain,
    });
    role = "OWNER";
  }
  // If company exists, user automatically joins as MEMBER

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create auth provider object
  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email,
  };

  // Create user with appropriate role
  const user = await User.create({
    company: company._id,
    name,
    email,
    password: hashedPassword,
    role,
    auths: [credentialProvider],
  });

  const populatedUser = await User.findById(user._id).populate("company");
  const { password: pass, ...userWithoutPassword } = populatedUser!.toObject();
  return userWithoutPassword;
};

const login = async (email: string, password: string) => {
  // Find user by email
  const user = await User.findOne({ email }).populate("company");

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  // Check if user has password set (credentials auth)
  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No password set for this account. Please use alternative login method."
    );
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  // Check if user is active
  if (user.isActive === "INACTIVE") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is inactive");
  }

  const { password: pass, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};



const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError(404, "User not found");
  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set your password. Now you can change the password from your profile password update"
    );
  }

  const hashedPassword = await hashPassword(plainPassword);

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = hashedPassword;
  user.auths = auths;

  await user.save();
  
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  if (!user || !user.password) throw new AppError(404, "User not found");

  const isOldPasswordValid = await verifyPassword(oldPassword, user.password);

  if (!isOldPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
  }

  user.password = await hashPassword(newPassword);

  await user.save();
 
};

export const AuthServices = {
  register,
  login,
  getNewAccessToken,
  changePassword,
  setPassword,
};
