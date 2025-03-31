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
