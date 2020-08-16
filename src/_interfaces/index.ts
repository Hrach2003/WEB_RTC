import { Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  username: string
  password: string,
  friends: IUser[]
}

export interface IRoom extends Document {
  name: string,
  password?: string,
  members?: IUser[] | string[]
  admin: IUser | string
}