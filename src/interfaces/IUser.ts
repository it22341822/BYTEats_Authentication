import {  Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    username : string;
    email : string;
    password : string;
    role : string;
    resetOTP : string | null;
    resetOTPExpires : Date | null;
    mobile : string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}