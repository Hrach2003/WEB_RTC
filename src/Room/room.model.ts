import { Schema, model } from "mongoose";
import { hashPassword } from "../helpers/createHashPassword";
import { IRoom } from "../_interfaces";



const Room: Schema<IRoom> = new Schema<IRoom>({
  name: {
    required: true,
    type: String,
    unique: true
  },
  password: {
    required: false,
    type: String,
    get: (): undefined => undefined,
    set: hashPassword
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  }],  
}, { 
  toJSON: { 
    virtuals: true,  
    getters: true
  } 
})

Room.virtual('isPrivate').get(function (this: IRoom) {
  return !!this.password
})

const RoomModel = model<IRoom>("Room", Room)
export { RoomModel } 