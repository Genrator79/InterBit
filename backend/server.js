const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoute = require("./routes/userRoutes");
const mentorRoute = require('./routes/mentorRoutes')
const interviewRoute = require('./routes/interviewRoutes')
const aiInterviewRoute = require('./routes/ai-interviewRoute')
const feedbackRoutes = require('./routes/feedback_routes')

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Root and health check routes
app.get('/', (req, res) => res.json({ success: true, message: "InterBit API is running" }));
app.get('/api/health', (req, res) => res.json({ status: "ok" }));

// Mount the router at /api
app.use('/api', userRoute);

// mentor route
app.use('/api/mentors', mentorRoute);

//interview route
app.use("/api/interviews", interviewRoute);

//aiInterviewRoute
app.use("/api/ai-interviews", aiInterviewRoute);

//feedback
app.use("/api/feedback", feedbackRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
