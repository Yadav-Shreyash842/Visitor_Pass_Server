const express = require ("express");
const cors = require ("cors")
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const visitorRoutes = require ("./routes/visitorRoutes");
const passRoutes = require("./routes/passRoutes");
const checkRoutes = require("./routes/checkRoutes");

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
connectDB();

app.get("/", (req , res) => {
    res.json({message : "Vister Pass syatem API is running"})
})

app.use("/api/auth", authRoutes)
app.use("/api/visitors", visitorRoutes)
app.use("/api/pass", passRoutes)
app.use("/api/checklog", checkRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});