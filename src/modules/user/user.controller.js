import { Router } from 'express'
import * as userService from './service/user.service.js';
import * as validators from "./user.validation.js"
import { validation } from '../../middleware/validation.middleware.js';
import { fileValidation, uploadDiskFile } from '../../utils/multer/local.multer.js';
import { authentication } from '../../middleware/auth.middleware.js';

const router=Router()

router.get("/profile",authentication(),userService.profile)
router.get("/shareProfile/:profileId",validation(validators.shareProfileValidation),authentication(),userService.shareProfile)
router.patch("/profile/updateEmail",validation(validators.updateEmailValidation),authentication(),userService.updateEmail)
router.patch("/profile/resetEmail",validation(validators.resetEmailValidation),authentication(),userService.resetEmail)
router.patch("/profile/updatePassword",validation(validators.updatePasswordValidation),authentication(),userService.updatePassword)
router.patch("/profile/updateProfile",validation(validators.updateProfileValidation),authentication(),userService.updateProfile)
router.patch("/profile/uploadFile",uploadDiskFile("user/profile",fileValidation.image).single("image"),authentication(),userService.uploadFile)
router.patch("/profile/uploadFileCover",uploadDiskFile("user/profile/cover",fileValidation.image).array("image",3),authentication(),userService.uploadFileCover)


export default router