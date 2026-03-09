const express = require ("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require ("../middleware/roleMiddleware");

const {generatePass, getPassByVisitor , verifyPass} = require ("../controllers/passController");

router.post("/", authMiddleware, authorize("admin", "security"), generatePass);
router.get("/", authMiddleware , authorize ("admin", "security", "visitor"), getPassByVisitor);
router.get("/verify/:passCode",  verifyPass);

module.exports = router;
