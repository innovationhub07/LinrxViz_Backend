import express from "express";
import {login,signup,forgotPassword, resetPassword,reset_Password} from "../Controllers/auth.js"
import {getAllUsers,updateProfile} from "../Controllers/users.js"
import auth from "../middlewares/auth.js"


const router = express.Router();


router.post("/signup",signup)
router.post("/login", login)

router.get("/getAllUsers", getAllUsers)
router.patch("/update/:id",auth,updateProfile)

router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:id/:token', resetPassword);
router.post('/reset-password/:id/:token', reset_Password);

export default router
