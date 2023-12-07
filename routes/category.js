const express = require("express");
const { categorysController } = require("../controllers");
const router = express.Router();

router.get("/", categorysController.getCategory);
router.post("/", categorysController.saveCategory);
router.put("/:id", categorysController.updateCategory);
router.delete("/:id", categorysController.deleteCategory);

module.exports = router;
