import { Request, Response } from "express";
import { UserModel } from "./user.model";

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const _id = req.user.aud
    const user = await UserModel.findById(_id)
    return res.json({ data: user })
  } catch (error) {
    res.json({ error: error.message })
  }
}

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find({}).populate('friends')
    return res.json({ data: users })
  } catch (error) {
    res.json({ error: error.message }).status(500)
  } 
}