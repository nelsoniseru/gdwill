const express = require("express")
const transactionController = require("../controller/transaction.controller")

const {authMiddleWare} = require("../middleware/auth.middleware")

const router = express.Router()

router.post("/deposit",authMiddleWare,transactionController.deposit)
router.get("/",authMiddleWare,transactionController.history)
router.post("/:id",authMiddleWare,transactionController.transaction)



module.exports = router;