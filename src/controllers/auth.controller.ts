import { Request, Response } from 'express';
import User from '../models/user.model';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';
import { IUser } from '../interfaces/IUser';

// this one is for the regular

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, mobile } = req.body;

    /*// Determine which model to use based on role
    let Model;
    if (role === 'user') Model = User;
    /!* else if (role === 'restaurant') Model = Restaurant;
    else if (role === 'delivery') Model = Delivery; *!/
    else return res.status(400).json({ error: "Invalid role" });*/

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser: IUser = await User.create({ username, email, password: hashedPassword, mobile });

    // Generate Token
    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({error});
  }
};

// Login User
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    /*// Determine which model to use
    let Model;
    if (role === 'user') Model = User;
    /!* else if (role === 'restaurant') Model = Restaurant;
    else if (role === 'delivery') Model = Delivery; *!/
    else return res.status(400).json({ error: "Invalid role" });*/

    // Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Compare Passwords
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate Token
    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error});
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, mobile } = req.body;

    const user = await User.findOne({ email, mobile });
    if (!user) return res.status(400).json({ error: "User not found" });

    //generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    await user.save();

    console.log(` OTP for ${user.mobile} is ${otp}`); // send OTP to user via SMS or email
    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error in forget password", error });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { mobile, otp } = req.body;

    const user = await User.findOne({ mobile });
    if (!user || user.resetOTP !== otp || user.resetOTPExpires! < new Date()) {
      return res.status(400).json({ error: "Invalid OTP or OTP expired" });
    }

    res.json({ message: "OTP verified: Set a new password now!!" });
  }catch (error) {  
    res.status(500).json({ message: "Error in verify OTP", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { mobile, newPassword } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ error: "User not found" });

    user.password = await hashPassword(newPassword);
    user.resetOTP = null; // Clear OTP after successful password reset
    user.resetOTPExpires = null; // Clear OTP expiration date
    await user.save();

    res.json({ message: "Password reset successfully" });
  }catch (error) {
    res.status(500).json({ message: "Error in reset password", error });
  }
};
