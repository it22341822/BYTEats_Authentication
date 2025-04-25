import { Schema, model } from "mongoose";
import { IDelivery } from "../interfaces/IDelivery";
import { comparePasswords } from "../utils/auth";

const deliverySchema = new Schema<IDelivery>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    nic: { type: String, required: false, unique: true }, 
    vehicle: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    currentLocation: {
      lat: {
        type: Number,
        default: 0,
      },
      lng: {
        type: Number,
        default: 0,
      }
    },
    address: {
      type: String,
      required: true,
    },
    licenseNumber: { type: String, required: false, unique: true },
    role: {
      type: String,
      default: "delivery",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

// Method to compare password
deliverySchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return comparePasswords(candidatePassword, this.password);
};

const Delivery = model<IDelivery>("Delivery", deliverySchema);
export default Delivery;