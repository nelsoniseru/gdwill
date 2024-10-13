const express = require("express")
const authController = require("../controller/auth.controller")
const {
    validateUserLoginInput,
    validateUserRegisterInput,
    validateOtpInput,
    validateResetPasswordInput 
}  =  require("../validator/validator")
const {authMiddleWare} = require("../middleware/auth.middleware")

const router = express.Router()

router.post("/register",authController.Register)
router.post("/login",authController.Login)
router.get("/get-all-users",authMiddleWare,authController.getUsers)
router.get("/get-balance",authMiddleWare,authController.getBalance)


module.exports = router;