const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

//register conltoller
const registerUser = async(req,res)=>{
    try{
        const {username, email, password, role}= req.body;

        //check if the user is already exists in our database
        const checkExistingUser = await prisma.user.findUnique({
            where: {email: email}
        })
        if(checkExistingUser)
        {
            return res.status(400).json({
                success : false,
                message : "User already exist with this email"
            })
        }
        
        //hash the user
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //now create a new user and save it in your database

        const newlyCreatedUser = await prisma.user.create({
            data: {
                username,
                email,
                password : hashedPassword,
                role : role?.toUpperCase() || "USER"
            } 
        })


        const accessToken = jwt.sign({
            userId : newlyCreatedUser.id,
            username : newlyCreatedUser.username,
            role : newlyCreatedUser.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn : "1d"
        })

        const sendUser = {
            userId : user.id,
            username : user.username,
            role : user.role
        };

        res.status(201).json({
            success : true,
            message : "User registration successful  🥳🥳",
            sendUser,
            accessToken
        })
    }
    catch(error){
        console.error("error in regestration",error);
        res.status(500).json({
            success : false,
            message : "some error occured ! Please try again"
        })
    }
}


//login controller
const loginUser = async(req,res)=>{
    try{
        const {email, password} = req.body;
        
        //find if the current user exists in database or not

        const user = await prisma.user.findUnique({where: {email: email}})   //user.password will be used to check password
         
        if(!user){
            return res.status(400).json({
                succss : false,
                message : "User doesn't exists !!!",
            })
        }
        //if password is correct or not

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch)
        {
            return res.status(400).json({
                success : false,
                message : "Invalid email or password !!!",
            })
        }

        //create user token

        const accessToken = jwt.sign({
            userId : user.id,
            username : user.username,
            role : user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn : "1d"
        })

        const sendUser = {
            userId : user.id,
            username : user.username,
            role : user.role
        };

        res.status(200).json({
            success : true,
            message : "Logged in successfully !",
            sendUser,
            accessToken
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success : false,
            message : "some error occured ! please try again"
        })
    }
};

//update password
const changePassword = async(req,res) => {
    try{
        const userId = req.userInfo.userId;

        //extract the new and old password

        const {oldPassword, newPassword} = req.body;

        //find the current logged user

        const user = await prisma.user.findUnique({where: {id: userId}});

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        //cheak if both new and old pass are same 

        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be the same as old password."
            });
        }

        //check if old password is correct

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
            success : false,
            message : "Old password is not correct! Please try again"
            });
        }

        //hast the new password

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword,salt); 

        //update user password

        await prisma.user.update({
            where: {id: userId},
            data: {password: newHashedPassword}
        });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully!"
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success : false,
            message : "some error occured ! please try again"
        }) 
    }
}


module.exports = {registerUser, loginUser, changePassword};