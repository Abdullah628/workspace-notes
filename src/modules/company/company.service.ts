import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { Company } from "./company.model";
import { User } from "../user/user.model";

const createCompany = async (payload: { name: string; domain?: string }) => {
  const existing = await Company.findOne({ domain: payload.domain });
  if (existing && payload.domain) {
    throw new AppError(httpStatus.BAD_REQUEST, "Company with this domain already exists");
  }
  return Company.create(payload);
};

const getCompanyById = async (id: string) => {
  const company = await Company.findById(id);
  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, "Company not found");
  }
  return company;
};

const getMyCompany = async (userId: string) => {
  const user = await User.findById(userId).populate("company");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user.company;
};

const listCompaniesByUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return Company.find({ _id: user.company });
};

const updateCompany = async (id: string, payload: { name?: string; domain?: string }) => {
  const company = await Company.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, "Company not found");
  }
  return company;
};

const deleteCompany = async (id: string) => {
  const company = await Company.findByIdAndDelete(id);
  if (!company) {
    throw new AppError(httpStatus.NOT_FOUND, "Company not found");
  }
  return company;
};

export const CompanyServices = {
  createCompany,
  getCompanyById,
  getMyCompany,
  listCompaniesByUser,
  updateCompany,
  deleteCompany,
};
