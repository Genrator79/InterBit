const express = require('express');
const { PrismaClient } = require('@prisma/client');
const {getAllUsers, registerUser, loginUser, changePassword} =require('../controllers/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');
const isAdminUser = require("../middleware/admin-middleware")

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (example)
router.get("/users", authMiddleware, isAdminUser, getAllUsers);

//Register a user
router.post('/auth/register', registerUser);

//login user
router.post("/auth/login", loginUser);
router.post("/user/changepassword", authMiddleware, changePassword);


module.exports = router;
