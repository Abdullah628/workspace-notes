import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createCompanySchema, updateCompanySchema } from "./company.validation";
import { CompanyControllers } from "./company.controller";

const router = Router();

router.post("/", checkAuth(), validateRequest(createCompanySchema), CompanyControllers.createCompany);
router.get("/my", checkAuth(), CompanyControllers.getMyCompany);
router.get("/:id", checkAuth(), CompanyControllers.getCompany);
router.patch("/:id", checkAuth(), validateRequest(updateCompanySchema), CompanyControllers.updateCompany);
router.delete("/:id", checkAuth(), CompanyControllers.deleteCompany);

export const CompanyRoutes = router;
