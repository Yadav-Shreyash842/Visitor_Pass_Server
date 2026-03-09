const express = require ("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require ("../middleware/roleMiddleware");

const { checkIn, checkOut, getAllLogs } = require("../controllers/checkLogController");

router.post("/checkin", authMiddleware, authorize("admin", "security"), checkIn);
router.put("/checkout/:logId", authMiddleware, authorize("admin", "security"), checkOut);
router.get("/", authMiddleware, authorize("admin", "security"), getAllLogs);

module.exports = router;