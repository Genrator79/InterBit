const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoute = require("./routes/userRoutes");
const mentorRoute = require('./routes/mentorRoutes')
const interviewRoute = require('./routes/interviewRoutes')
const aiInterviewRoute = require('./routes/ai-interviewRoute')

const app = express();

// Middlewares
app.use(cors(
  // {origin: "http://localhost:9000"}
));
app.use(express.json());

// Mount the router at /api/user
app.use('/api', userRoute);

// Root route
app.get('/api', (req, res) => res.send('This is home page!'));

// mentor route
app.use('/api/mentors', mentorRoute);

//interview route
app.use("/api/interviews", interviewRoute);

//aiInterviewRoute
app.use("/api/ai-interviews", aiInterviewRoute);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
