const CheckLog = require ("../Models/Checklog");
const Pass = require ("../Models/Pass");
const Visitor = require ("../Models/Visitor");


const checkIn = async (req, res) => {
  try {
    const { passCode } = req.body;

    const pass = await Pass.findOne({ passCode });
    if (!pass) return res.status(404).json({ message: "Pass nahi mila" });

    const log = await CheckLog.create({
      visitor: pass.visitor,
      pass: pass._id,
      checkInTime: new Date(),
      scannedBy: req.user.id,
      status: "checked-in",
    });

   
    await Visitor.findByIdAndUpdate(pass.visitor, { status: "checked-in" });

    res.status(201).json({ message: "✅ Check-in successful!", log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const checkOut = async (req, res) => {
  try {
    const log = await CheckLog.findByIdAndUpdate(
      req.params.logId,
      { checkOutTime: new Date(), status: "checked-out" },
      { new: true }
    );

    await Visitor.findByIdAndUpdate(log.visitor, { status: "checked-out" });

    res.json({ message: "✅ Check-out successful!", log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllLogs = async (req, res) => {
  try {
    const logs = await CheckLog.find()
      .populate("visitor", "name email phone")
      .populate("scannedBy", "name")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkIn, checkOut, getAllLogs };