const express = require('express');
const { PrismaClient } = require('@prisma/client');
const {registerUser, loginUser, changePassword} =require('../controllers/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');


const router = express.Router();
const prisma = new PrismaClient();

// Get all users (example)
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log("hii from api/users");
    return res.json(users); // send response to frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Register a user
router.post('/auth/register', registerUser);

//login user
router.post("/auth/login", loginUser);
router.post("/user/changepassword", authMiddleware, changePassword);


module.exports = router;
