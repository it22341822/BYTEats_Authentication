import { Request, Response } from 'express';
import Restaurant from '../models/restaurant.model';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';
import { IRestaurant } from '../interfaces/IRestaurant';


export const register = async (req: Request, res: Response) => {
    try {
        const {name, location, owner_name, email, password, mobile} = req.body;

        // Check if Restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) return res.status(400).json({ error: "Email already registered" });

        // Hash Password
        const hashedPassword = await hashPassword(password);

        // Create Restaurant
        const newRestaurant: IRestaurant = await Restaurant.create({ name, location, owner_name, email, password: hashedPassword, mobile });

        // Generate Token
        const token = generateToken(newRestaurant._id.toString(), newRestaurant.role);

        res.status(201).json({ token, restaurant: newRestaurant });
    } catch (error) {
        res.status(500).json({error});
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find restaurant
        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) return res.status(400).json({ error: "restaurant not found" });

        // Compare Passwords
        const isMatch = await comparePasswords(password, restaurant.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Generate Token
        const token = generateToken(restaurant._id.toString(), restaurant.role);

        res.status(200).json({ token, restaurant });
    } catch (error) {
        res.status(500).json({ error});
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try{
        const { email, mobile } = req.body;

        const restaurant = await Restaurant.findOne({ email, mobile });
        if (!restaurant) return res.status(400).json({ error: "Restaurant not found" });

        //generate OTP and send it to the restaurant's mobile number
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        restaurant.resetOTP = otp;
        restaurant.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes
        await restaurant.save();

        console.log(`OTP for ${restaurant.mobile}: ${otp}`); // Replace with actual SMS sending logic
        res.status(200).json({ message: "OTP sent successfully" });

    }catch(error) {
        res.status(500).json({ message: "Error in forget password", error });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { mobile, otp } = req.body;

        const restaurant = await Restaurant.findOne({ mobile });
        if (!restaurant || restaurant.resetOTP !== otp || restaurant.resetOTPExpires! < new Date()) {
            return res.status(400).json({ error: "Invalid OTP or OTP expired" });
        }

        res.json({ message: "OTP verified : Set a new password now !!" });
    } catch (error) {
        res.status(500).json({ message: "Error in verify OTP", error });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try{
        const { mobile, newPassword } = req.body;

        const restaurant = await Restaurant.findOne({ mobile });
        if (!restaurant) return res.status(400).json({ error: "Restaurant not found" });

        restaurant.password = await hashPassword(newPassword);
        restaurant.resetOTP = null; // Clear OTP after successful password reset
        restaurant.resetOTPExpires = null; // Clear OTP expiration date
        await restaurant.save();

        res.json({ message: "Password reset successfully" });
    }catch (error) {
        res.status(500).json({ message: "Error in reset password", error });
    }
};