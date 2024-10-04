const express = require("express")
const propertyController = require("../controller/property.controller")
const upload = require("../utils/multer")

const {authMiddleWare} = require("../middleware/auth.middleware")

const router = express.Router()

router.post("/",authMiddleWare,propertyController.addProperty)
router.get("/:id",authMiddleWare,propertyController.getPropertyById)
router.get("/",authMiddleWare,propertyController.getProperties)
router.put("/:id",authMiddleWare,propertyController.updateProperty)
router.delete("/:id",authMiddleWare,propertyController.deleteProperty)


module.exports = router;