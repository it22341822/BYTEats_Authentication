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

export const updateDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      age,
      nic,
      vehicle,
      mobile,
      email,
      currentLocation,
      address,
      licenseNumber,
      isAvailable
    } = req.body;

    // Check if delivery person exists
    const delivery = await Delivery.findById(id).exec();
    if (!delivery) {
      return res.status(404).json({ error: "Delivery person not found" });
    }

    // Create update object with only the provided fields
    const updateData: Partial<IDelivery> = {};
    
    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (nic) updateData.nic = nic;
    if (vehicle) updateData.vehicle = vehicle;
    if (mobile) updateData.mobile = mobile;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;
    if (typeof isAvailable === 'boolean') updateData.isAvailable = isAvailable;

    // Handle nested currentLocation object
    if (currentLocation) {
      updateData.currentLocation = {
        lat: currentLocation.lat !== undefined ? currentLocation.lat : delivery.currentLocation.lat,
        lng: currentLocation.lng !== undefined ? currentLocation.lng : delivery.currentLocation.lng
      };
    }

    // Save updates
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();

    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Delivery Person Delete
export const deleteDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if delivery person exists with proper typing
    const delivery = await Delivery.findById(id).lean<IDelivery>().exec();
    if (!delivery) return res.status(404).json({ error: "Delivery person not found" });

    await Delivery.findByIdAndDelete(id).exec();

    res.status(200).json({ message: "Delivery person account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};