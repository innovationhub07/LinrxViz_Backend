import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import users from "../models/auth.js"
import nodemailer from 'nodemailer';
import dotenv from "dotenv"
dotenv.config();


export const signup = async (req,res) => {
    const { Fname,Lname, email, password} = req.body;

    try{
          const existinguser = await users.findOne({ email });
          if(existinguser){
            return res.status(400).json({message : "User already Exist."})
          }

          const hashedPassword = await bcrypt.hash(password, 12)
          const newUser = await users.create({Fname,Lname, email, password: hashedPassword})
          const token = jwt.sign({ email : newUser.email , id: newUser._id }, process.env.JWT_SECRET,{expiresIn: "1h"})
          res.status(200).json({ result : newUser, token })
    } catch(error){
        res.status(500).json("Someting wnt wrong...")
    }
      
}

export const login = async (req,res) => {
    const {email, password} = req.body;
    try{
        
       const existinguser = await users.findOne({ email })
       if(!existinguser){
        return res.status(400).json({message : "User don't Exist."})
      }
    
      const isPasswordCrt = await bcrypt.compare(password,existinguser.password)
      if(!isPasswordCrt){
        return res.status(400).json({message : "Incorrect Username or Password"})
      }

      const token = jwt.sign({ email : existinguser.email , id: existinguser._id }, process.env.JWT_SECRET,{expiresIn: "1h"})

      res.status(200).json({ result : existinguser, token })
      
  } catch(error){
      res.status(500).json("Someting wnt wrong...")
  } 
}
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({message : "User don't Exist."});
    }
    
    const secret = process.env.JWT_SECRET + user.password
    const token = jwt.sign({ email: user.email ,id: user._id }, secret, { expiresIn: '1h' });

    const resetLink = `https://impossible-belt-hen.cyclic.app/user/reset-password/${user._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'innovationhub07@gmail.com',
        pass: process.env.EMAIL_SECRET
      }
    });
    
    var mailOptions = {
      from: 'innovationhub07@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Hello,\n\nIt has come to our attention that you may need to reset your password. To assist you with this, simply follow the link below to breeze through the password reset process:\n\n${resetLink}\n\nIf you didn't request this, you can ignore this email.\n\nBest regards,\nThe LINrxVIZ Team`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return res.status(400).json({message : "User don't Exist."});
      } else {
        return res.status(400).json({message : "Password reset link sent to your email"});

      }
    }
    );

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export const resetPassword = async (req, res) => {
  const { id,token } = req.params;
  const oldUser = await users.findOne({ _id : id });
  if(!oldUser){
    return res.json({ status : "User Not Exists !"})
  }
  const secret = process.env.JWT_SECRET + oldUser.password
  try{
      const verify = jwt.verify(token,secret)
      res.render("index",{email : verify.email, alert:"",status : "Not verified"})
  }
  catch(error){
      res.send("Not Verified")
  }
};

export const reset_Password = async (req, res) => {
  const { id,token } = req.params;
  const {password} = req.body;
  var Status = "verified"
  var Alert = ""
  if(password != req.body['confirm-password']){
    Status = "Not Verified"
    Alert = "Error! Confirm password not match"
  }
  
  
  const oldUser = await users.findOne({ _id : id });
  if(!oldUser){
    return res.json({ status : "User Not Exists !"})
  }
  const secret = process.env.JWT_SECRET + oldUser.password
  try{
      const verify = jwt.verify(token,secret);
      if(Status == "verified") {
      const encryptedPassword = await bcrypt.hash(password,10);
      await users.updateOne(
        {_id : id},
        {
          $set : {
            password: encryptedPassword,
          }
        }
      )
    }
      res.render("index",{email : verify.email,alert:Alert ,status : Status});
        

  }
  catch(error){
    res.json({status : "Something went wrong"});
  }
};




