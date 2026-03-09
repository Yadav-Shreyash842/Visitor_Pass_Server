# Visitor Pass Management System - Backend API

A comprehensive Node.js/Express backend for managing visitor passes with role-based authentication, QR codes, and email notifications.

## 🚀 Features

- **Role-Based Authentication** (Admin, Security, Employee, Visitor)
- **JWT Token-based Authorization**
- **Visitor Management** (Create, Approve, Reject)
- **Digital Pass Generation** with QR Codes
- **Check-in/Check-out Tracking**
- **Email Notifications** (Login, Approval, Rejection)
- **MongoDB Database**
- **RESTful API Architecture**

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or MongoDB Atlas)
- Gmail account (for email notifications)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Yadav-Shreyash842/Visitor_Pass_Server.git
   cd Visitor_Pass_Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Visitor_pass
   JWT_SECRET=your-super-secret-key-here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   NODE_ENV=development
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `PUT /api/auth/profile` - Update profile (authenticated)

### Visitors
- `GET /api/visitors` - Get all visitors (authenticated)
- `POST /api/visitors/createVisitor` - Create visitor (public)
- `GET /api/visitors/:id` - Get visitor by ID
- `PUT /api/visitors/:id` - Update visitor
- `PATCH /api/visitors/:id/approve` - Approve visitor
- `PATCH /api/visitors/:id/reject` - Reject visitor
- `DELETE /api/visitors/:id` - Delete visitor

### Passes
- `POST /api/pass` - Generate pass (admin/security)
- `GET /api/pass` - Get all passes (authenticated)
- `GET /api/pass/verify/:passCode` - Verify pass (public)

### Check Logs
- `POST /api/checklog/check-in` - Check-in visitor
- `POST /api/checklog/check-out` - Check-out visitor
- `GET /api/checklog` - Get all check logs

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `mysecretkey123` |
| `EMAIL_USER` | Gmail address for notifications | `your@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `abcd efgh ijkl mnop` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## 👥 User Roles

1. **Admin** - Full system access
2. **Security** - Operational access (approve, verify passes)
3. **Employee** - Basic access (create visitors, view passes)
4. **Visitor** - Self-service access (view own pass)

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → App passwords
3. Generate a new app password for "Mail"
4. Use the 16-character password in `EMAIL_PASS`

## 🗄️ Database Models

### User
- name, email, password (hashed), role
- Used for authentication and authorization

### Visitor
- name, email, phone, photo, purpose, host
- status: pending, approved, rejected, checked-in, checked-out

### Pass
- visitor (ref), passCode (UUID), qrCodeImages
- validFrom, validTo, isActive

### CheckLog
- visitor (ref), pass (ref), checkInTime, checkOutTime
- checkedBy (ref), status

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Render
- Railway
- Heroku
- AWS EC2

## 📦 Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `nodemailer` - Email sending
- `qrcode` - QR code generation
- `uuid` - Unique ID generation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `helmet` - Security headers

## 🔧 Project Structure

```
server/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── visitorController.js   # Visitor management
│   ├── passController.js      # Pass generation
│   └── checkLogController.js  # Check-in/out logic
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   └── roleMiddleware.js      # Role-based access
├── Models/
│   ├── User.js               # User schema
│   ├── Visitor.js            # Visitor schema
│   ├── Pass.js               # Pass schema
│   └── Checklog.js           # Check log schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── visitorRoutes.js      # Visitor endpoints
│   ├── passRoutes.js         # Pass endpoints
│   └── checkRoutes.js        # Check log endpoints
├── utils/
│   ├── email.js              # Email utility
│   └── generateQRCode.js     # QR code utility
├── .env                       # Environment variables (not committed)
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
└── server.js                 # Entry point
```

## 🧪 Testing

Test the API locally:

```bash
# Health check
curl http://localhost:3000/

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"employee"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Role-based access control
- CORS configuration
- Helmet security headers
- Input validation
- Body size limits (50MB for images)

## 🐛 Troubleshooting

**MongoDB connection error:**
- Verify `MONGO_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**Email not sending:**
- Verify Gmail app password
- Check `EMAIL_USER` and `EMAIL_PASS`
- Ensure 2FA is enabled on Gmail

**CORS errors:**
- Update CORS origin in `server.js`
- Ensure frontend URL is whitelisted

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: yadavshreyash484@gmail.com

## 🔗 Related Repositories

- **Frontend:** [Visitor_Pass_Client](https://github.com/Yadav-Shreyash842/Visitor_Pass_Client)

---

Made with ❤️ by Shreyash Yadav
