const Pass = require ("../Models/Pass")
const Visitor = require ("../Models/Visitor");

const {sendEmail} = require ("../utils/email");
const {generateQRCode} = require ("../utils/generateQRCode")
const {v4 : uuidv4} = require("uuid");

exports.generatePass = async (req , res ) => {
    try{
        const {visitorId , appoinmentId , validFrom , validTill} = req.body;
        const visitor = await Visitor.findById(visitorId);
        if(!visitor){
            return res.status(404).json({message : "visitor not found"})
        }
        
        const passCode = uuidv4();
        const qrData = {passCode , visitorId , validFrom , validTill};
        const qrCodeImage = await generateQRCode(qrData);
        const pass = await Pass.create({
            visitor : visitorId,
            appoinment : appoinmentId,
            passCode,
            qrCodeImages : qrCodeImage,
            validFrom,
            validTo : validTill,
            issuedBy: req.user.id,
        });

        await sendEmail({
            to: visitor.email,
            subject: "✅ Your Visitor Pass is Ready!",
            html: `
                <h2>Hello ${visitor.name}!</h2>
                <p>Your visitor pass has been issued.</p>
                <p><strong>Pass Code:</strong> ${passCode}</p>
                <p><strong>Valid From:</strong> ${validFrom}</p>
                <p><strong>Valid Till:</strong> ${validTill}</p>
                <img src="${qrCodeImage}" alt="QR Code" />
            `,
        });

        res.status(201).json(pass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPassByVisitor = async (req , res) => {
    try{
        const passes = await Pass.find().populate("visitor", "name email").populate("issuedBy", "name").sort({createdAt : -1});
        res.json(passes);
    } catch (error){
        res.status(500).json({message : error.message ||  "Server Error"})
    }
};

exports.verifyPass = async (req, res) => {
  try {
    const pass = await Pass.findOne({ passCode: req.params.passCode })
      .populate("visitor", "name email phone photo");

    if (!pass) return res.status(404).json({ message: "Pass valid nahi hai" });

    const now = new Date();
    if (now > new Date(pass.validTo)) {
      return res.status(400).json({ message: "Pass expire ho gaya hai" });
    }

    res.json({ valid: true, pass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
