import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CompanyServices } from "./company.service";
import AppError from "../../errorHelpers/AppError";

const createCompany = catchAsync(async (req: Request, res: Response) => {
  const company = await CompanyServices.createCompany(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Company Created Successfully",
    data: company,
  });
});

const getCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const company = await CompanyServices.getCompanyById(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Company Retrieved Successfully",
    data: company,
  });
});

const getMyCompany = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const company = await CompanyServices.getMyCompany(decodedToken.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My Company Retrieved Successfully",
    data: company,
  });
});

const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const company = await CompanyServices.updateCompany(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Company Updated Successfully",
    data: company,
  });
});

const deleteCompany = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CompanyServices.deleteCompany(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Company Deleted Successfully",
    data: null,
  });
});

export const CompanyControllers = {
  createCompany,
  getCompany,
  getMyCompany,
  updateCompany,
  deleteCompany,
};
