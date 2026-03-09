const User = require ("../Models/User");
const jwt = require ("jsonwebtoken");
const bcrypt = require ("bcryptjs");
const { sendEmail } = require("../utils/email");


exports.registerUser = async (req, res) => {
    try{
        const {name , email , password , role} = req.body;

        const userExists = await User.findOne({email});
        if (userExists){
            return res.status(400).json({message : "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            role
        });
        res.status(201).json(user)
    } catch (error){
        res.status(500).json({message : error.message ||  "Server Error"})
    }
};

exports.loginUser = async (req, res) => {
    try{
        const {email , password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if (!isMatch){
            return res.status(400).json({message : "Invalid email or password"});
        }

        const token = jwt.sign({
            id: user._id,
            role : user.role
        },  process.env.JWT_SECRET,{expiresIn : "7d"});
        
        // Send login notification email
        const loginTime = new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'long'
        });

        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
                    .info-item { margin: 10px 0; }
                    .label { font-weight: bold; color: #667eea; }
                    .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
                    .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0;">🔐 Login Alert</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Visitor Pass System</p>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${user.name}</strong>,</p>
                        <p>A successful login to your account was detected.</p>
                        
                        <div class="info-box">
                            <h3 style="margin-top: 0; color: #667eea;">Login Details</h3>
                            <div class="info-item">
                                <span class="label">Account:</span> ${user.email}
                            </div>
                            <div class="info-item">
                                <span class="label">Role:</span> ${user.role.toUpperCase()}
                            </div>
                            <div class="info-item">
                                <span class="label">Login Time:</span> ${loginTime}
                            </div>
                            <div class="info-item">
                                <span class="label">IP Address:</span> ${req.ip || 'Unknown'}
                            </div>
                        </div>

                        <div class="alert">
                            <strong>⚠️ Security Notice:</strong> If this wasn't you, please contact your system administrator immediately and change your password.
                        </div>

                        <p style="margin-top: 20px;">This is an automated security notification to keep your account safe.</p>
                    </div>
                    <div class="footer">
                        <p>Visitor Pass System - Secure Access Management</p>
                        <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send email (don't wait for it to complete)
        sendEmail({
            to: user.email,
            subject: '🔐 Login Alert - Visitor Pass System',
            html: emailHtml
        }).catch(err => console.error('Failed to send login email:', err));

        res.json({token , user})
       
    } catch(error){
        res.status(500).json({message : error.message ||  "Server Error"})
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If changing password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to change password" });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            // Hash new password
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Update basic info
        if (name) user.name = name;
        if (email) {
            // Check if email is already taken by another user
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        await user.save();

        // Return user without password
        const updatedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.json({ 
            message: "Profile updated successfully", 
            user: updatedUser 
        });

    } catch (error) {
        res.status(500).json({ message: error.message || "Server Error" });
    }
}