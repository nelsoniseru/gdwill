const express = require("express")
const propertyController = require("../controller/property.controller")
const upload = require("../utils/multer")

const {authMiddleWare} = require("../middleware/auth.middleware")

const router = express.Router()

router.post("/",authMiddleWare,upload.array('images'),propertyController.addProperty)


module.exports = router;