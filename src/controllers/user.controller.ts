import { Request, Response } from 'express';
import Delivery from '../models/delivery.model';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';
import { IDelivery } from '../interfaces/IDelivery';

// Delivery Person Registration
export const registerDelivery = async (req: Request, res: Response) => {
  try {
    const { username, email, password, vehicleType, vehicleNumber, phone } = req.body;

    // Check if delivery person already exists
    const existingDelivery = await Delivery.findOne({ email });
    if (existingDelivery) return res.status(400).json({ error: "Email already registered" });

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Create delivery person
    const newDelivery: IDelivery = await Delivery.create({ 
      username, 
      email, 
      password: hashedPassword,
      vehicleType,
      vehicleNumber,
      phone,
      role: 'delivery' // explicitly setting role
    });

    // Generate Token
    const token = generateToken(newDelivery._id.toString(), newDelivery.role);

    res.status(201).json({ token, delivery: newDelivery });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Delivery Person Login
export const loginDelivery = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find Delivery Person
    const delivery = await Delivery.findOne({ email });
    if (!delivery) return res.status(400).json({ error: "Delivery person not found" });

    // Compare Passwords
    const isMatch = await comparePasswords(password, delivery.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate Token
    const token = generateToken(delivery._id.toString(), delivery.role);

    res.status(200).json({ token, delivery });
  } catch (error) {
    res.status(500).json({ error });
  }
};