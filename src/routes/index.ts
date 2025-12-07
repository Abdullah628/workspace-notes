import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route"
import { UserRoutes } from "../modules/user/user.route";
import { NoteRoutes } from "../modules/note/note.route";
import { CompanyRoutes } from "../modules/company/company.route";
import { WorkspaceRoutes } from "../modules/workspace/workspace.route";
import { VoteRoutes } from "../modules/vote/vote.route";
import { NoteHistoryRoutes } from "../modules/noteHistory/noteHistory.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes
    },

    {
        path: "/user",
        route: UserRoutes
    },

    {
        path: "/companies",
        route: CompanyRoutes
    },

    {
        path: "/workspaces",
        route: WorkspaceRoutes
    },
    
    {
        path: "/notes",
        route: NoteRoutes
    },

    {
        path: "/votes",
        route: VoteRoutes
    },

    {
        path: "/history",
        route: NoteHistoryRoutes
    },

];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});