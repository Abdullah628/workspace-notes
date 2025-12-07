import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createWorkspaceSchema, updateWorkspaceSchema, listWorkspacesByCompanySchema } from "./workspace.validation";
import { WorkspaceControllers } from "./workspace.controller";

const router = Router();

router.post("/", checkAuth(), validateRequest(createWorkspaceSchema), WorkspaceControllers.createWorkspace);
router.get("/my", checkAuth(), WorkspaceControllers.listMyWorkspaces);
router.get("/company/:companyId", checkAuth(), validateRequest(listWorkspacesByCompanySchema), WorkspaceControllers.listWorkspacesByCompany);
router.get("/:id", checkAuth(), WorkspaceControllers.getWorkspace);
router.patch("/:id", checkAuth(), validateRequest(updateWorkspaceSchema), WorkspaceControllers.updateWorkspace);
router.delete("/:id", checkAuth(), WorkspaceControllers.deleteWorkspace);

export const WorkspaceRoutes = router;
