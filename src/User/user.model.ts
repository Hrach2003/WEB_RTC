import { Schema, model } from "mongoose";
import { hashPassword } from "../helpers/createHashPassword";
import { IUser } from "../_interfaces";

const User: Schema<IUser> = new Schema<IUser>({
  email: {
    required: true,
    type: String,
    unique: true
  },
  username: {
    required: true,
    type: String,
    unique: true
  },
  password: {
    required: true,
    type: String,
    get: (): undefined => undefined,
    set: hashPassword
  },
  joinedIn: [{
    type: Schema.Types.ObjectId,
    ref: 'Room'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]  
}, {
  toJSON: {
    getters: true 
  }
})

const UserModel = model<IUser>("User", User)
export { UserModel }