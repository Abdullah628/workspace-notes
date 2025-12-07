import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "../user/user.validation";
import { loginZodSchema, changePasswordZodSchema, setPasswordZodSchema } from "./auth.validation";

const router = Router()

router.post("/register", validateRequest(createUserZodSchema), AuthControllers.register)
router.post("/login", validateRequest(loginZodSchema), AuthControllers.login)
router.post("/credentials-login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/change-password", checkAuth(), validateRequest(changePasswordZodSchema), AuthControllers.changePassword)
router.post("/set-password", checkAuth(), validateRequest(setPasswordZodSchema), AuthControllers.setPassword)

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController)

export const AuthRoutes = router;