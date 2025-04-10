import {  Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
    _id : Schema.Types.ObjectId;
    name : string;
    location : string;
    owner_name : string;
    email : string;
    password : string;
    mobile : string;
    role : string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}