import mongoose from 'mongoose'
import { RoomModel } from "./room.model"
import { Request, Response } from "express"
import { v4 } from "uuid"
import { UserModel } from "../User/user.model"
import { Schema } from "mongoose"
import { comparePassword } from '../helpers/createHashPassword'


export const getAllRooms = async (req: Request, res: Response) => {
  const rooms = await RoomModel.find({}).populate('admin')
  res.json({ data: rooms })
}


export const createRoom = async (req: Request, res: Response) => {
  const { name }: { name: string} = req.body 
  const admin = req.user.aud as mongoose.Types.ObjectId

  if(!name) return res.json({ error: 'No room name' })

  const roomExists = await RoomModel.findOne({ name })
  if(roomExists) return res.json({ error: 'Name already in use' })

  const room = new RoomModel({
    name, admin, members: [admin]
  })
  try {
    await room.save()
    const data = room.populate('admin')
    res.json({ data })
  } catch (error) {
    console.error(error)
    res.json({ error: error.message })
  }
}

export const joinRoom = async (req: Request, res: Response) => {
  const { id } = req.query
  if(!id) return res.redirect('/room');

  const room = await RoomModel.findById(id)
  res.json({ data: room })
}


export const getUserCreatedRooms = async (req: Request, res: Response) => {
  const admin = req.user.aud as string
  const room = await RoomModel.find({ admin })
  res.json({ data: room })
}

export const getRoom = async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const room = await RoomModel.findOne({ name })
    
    res.json({ data: room }) 
  } catch (error) {
    res.redirect('/room/')
  }
}
