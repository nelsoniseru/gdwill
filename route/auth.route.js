const express = require("express")
const authController = require("../controller/auth.controller")
const upload = require("../utils/multer")
const {
    validateUserLoginInput,
    validateUserRegisterInput,
    validateOtpInput,
    validateResetPasswordInput 
}  =  require("../validator/validator")
const {authMiddleWare} = require("../middleware/auth.middleware")

const router = express.Router()

router.post("/register",upload.single('img'),authController.Register)
router.post("/login",authController.Login)
router.post("/resend-code",authController.PostResend)
router.post("/verify-code",authController.PostVerifyCode)
router.post("/verify-email",authController.postVerifyMail)
router.put("/reset-password",authController.postResetPassword)
router.put("/profile-edit",authMiddleWare,authController.postEditProfile)
router.put("/password-edit",authMiddleWare,authController.passwordEdit)

module.exports = router;