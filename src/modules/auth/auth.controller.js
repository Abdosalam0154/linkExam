
import { Router } from 'express'
import * as registrationService from './service/registration.service.js';
import { validation } from '../../middleware/validation.middleware.js';
import * as validators from "./auth.validation.js"
import * as loginService from './service/login.service.js';
const router = Router();


router.post("/signup",validation(validators.signup),registrationService.signup)
router.patch("/confirmEmail",validation(validators.confirmEmail),registrationService.confirmEmail)
router.post("/login",validation(validators.login),loginService.login)
router.post("/loginWithGmail",loginService.loginWithGmail)
router.get("/refreshToken",loginService.refreshToken)
router.patch("/forgotPassword",validation(validators.forgotPassword),loginService.forgotPassword)
router.patch("/verifiedforgotPassword",validation(validators.verifiedforgotPassword),loginService.verifiedforgotPassword)
router.patch("/resetPassword",validation(validators.resetPassword),loginService.resetPassword)

export default router