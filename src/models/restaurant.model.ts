import { Schema, model } from "mongoose";
import { IRestaurant } from "../interfaces/IRestaurant";

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    owner_name: {
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
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "restaurant",
    },
  },
  { timestamps: true }
);

const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);
export default Restaurant;