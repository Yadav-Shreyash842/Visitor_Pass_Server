const Visitor = require ("../Models/Visitor");
const Pass = require("../Models/Pass");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../utils/email");

exports.getAllVisitors = async (req,res) => {
    try {
        const visitor = await Visitor.find().sort({createdAt : -1});
        res.json(visitor)
    } catch (error){
        res.status(500).json({message : error.message ||  "Server Error"})
    }
}

exports.createVisitor = async (req , res) => {
    try{
     const visitor = await Visitor.create(req.body);
     res.status(201).json(visitor)
} 
catch(error){
    res.status(500).json({message : error.message ||  "Server Error"})
}
};

exports.getVisitors = async (req , res) => {
    try{
        const visitor = await Visitor.find();
        res.json(visitor)
    } catch(error){
        res.status(500).json({message : error.message ||  "Server Error"})
    }
};

exports.getVisitorById = async (req , res) => {
    try{
        const visitor = await Visitor.findById(req.params.id);
        res.json(visitor);
    } catch(error){
        res.status(500).json({message : error.message ||  "Server Error"})
    }
}

exports.updateVisitor = async (req , res) => {
    try {
        const visitor = await Visitor.findByIdAndUpdate(req.params.id , req.body, {new: true})
        if(!visitor){
            return res.status(404).json({message : "visitor not found"})
        }
        res.json(visitor)
    } catch(error){
        res.status(500).json({message : error.message ||  "Server Error"})
    }
};

exports.deleteVisitor = async (req , res) => {
    try{
        const visitor = await Visitor.findByIdAndDelete(req.params.id)
        if(!visitor){
            return res.status(404).json({Message : "visitor not found"})
        }
        res.json({message : "visitor pass deleted", visitor})
    } catch (error){
        res.status(500).json({message : error.message ||  "Server Error"})
    }
};

// Approve Visitor
exports.approveVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id);
        
        if (!visitor) {
            return res.status(404).json({ message: "Visitor not found" });
        }

        if (visitor.status === "approved") {
            return res.status(400).json({ message: "Visitor already approved" });
        }

        // Update visitor status
        visitor.status = "approved";
        await visitor.save();

        // Generate Pass with QR Code
        const passCode = uuidv4();
        const validFrom = new Date();
        const validTo = new Date();
        validTo.setHours(validTo.getHours() + 24); // Valid for 24 hours

        const pass = await Pass.create({
            visitor: visitor._id,
            passCode,
            validFrom,
            validTo,
            isActive: true
        });

        // Send approval email with QR code
        try {
            await sendEmail({
                to: visitor.email,
                subject: "Visitor Pass Approved",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #10b981;">✅ Your Visitor Pass is Approved!</h2>
                        <p>Dear ${visitor.name},</p>
                        <p>Your visitor request has been approved. Here are your pass details:</p>
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Pass Code:</strong> ${passCode}</p>
                            <p><strong>Valid From:</strong> ${validFrom.toLocaleString()}</p>
                            <p><strong>Valid To:</strong> ${validTo.toLocaleString()}</p>
                            <p><strong>Purpose:</strong> ${visitor.purpose}</p>
                        </div>
                        <p>Please show this pass code at the reception desk along with a valid ID.</p>
                        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
                            This is an automated email. Please do not reply.
                        </p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // Don't fail the approval if email fails
        }

        res.json({ 
            message: "Visitor approved successfully", 
            visitor,
            pass 
        });

    } catch (error) {
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// Reject Visitor
exports.rejectVisitor = async (req, res) => {
    try {
        const { reason } = req.body;
        const visitor = await Visitor.findById(req.params.id);
        
        if (!visitor) {
            return res.status(404).json({ message: "Visitor not found" });
        }

        if (visitor.status === "rejected") {
            return res.status(400).json({ message: "Visitor already rejected" });
        }

        // Update visitor status
        visitor.status = "rejected";
        visitor.rejectionReason = reason || "No reason provided";
        await visitor.save();

        // Send rejection email
        try {
            await sendEmail({
                to: visitor.email,
                subject: "Visitor Pass Request - Update",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #ef4444;">❌ Visitor Pass Request Update</h2>
                        <p>Dear ${visitor.name},</p>
                        <p>We regret to inform you that your visitor request has been declined.</p>
                        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                            <p><strong>Reason:</strong> ${reason || "No specific reason provided"}</p>
                        </div>
                        <p>If you believe this is an error, please contact the host directly.</p>
                        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
                            This is an automated email. Please do not reply.
                        </p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // Don't fail the rejection if email fails
        }

        res.json({ 
            message: "Visitor rejected successfully", 
            visitor 
        });

    } catch (error) {
        res.status(500).json({ message: error.message || "Server Error" });
    }
};