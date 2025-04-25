import { Document, Schema } from 'mongoose';

export interface IDelivery extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    age: number;
    nic: string;
    vehicle: string;
    mobile: string;
    email: string;
    password: string;
    currentLocation: {
        lat: number;
        lng: number;
    };
    address: string;
    licenseNumber: string;
    role: string;
    isAvailable: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}