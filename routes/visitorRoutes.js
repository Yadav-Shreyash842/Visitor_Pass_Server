const express = require ("express")
const router = express.Router();
const authMiddleware = require ("../middleware/authMiddleware");
const roleMiddleware = require ("../middleware/roleMiddleware")

const {  getAllVisitors ,createVisitor , getVisitors , getVisitorById , updateVisitor , deleteVisitor, approveVisitor, rejectVisitor} = require("../controllers/visitorController");

router.get("/", authMiddleware , roleMiddleware("admin", "security","employee", "visitor"), getAllVisitors)
router.post("/createVisitor", createVisitor);
router.get("/all", getVisitors);
router.get("/:id", authMiddleware, roleMiddleware("admin" , "security" , "employee"), getVisitorById);
router.put("/:id", authMiddleware , roleMiddleware("admin", "employee"), updateVisitor);
router.patch("/:id/approve", authMiddleware, roleMiddleware("admin", "security", "employee"), approveVisitor);
router.patch("/:id/reject", authMiddleware, roleMiddleware("admin", "security", "employee"), rejectVisitor);
router.delete("/:id", authMiddleware , roleMiddleware("admin"), deleteVisitor) 

module.exports = router;