import { Request, Response } from 'express'
import { UserModel } from '../user.model'
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '../../helpers/JWT.helper'
import { client } from '../../helpers/init_nodeCache'
import { IUser } from '../../_interfaces'
import { comparePassword } from '../../helpers/createHashPassword'
import consola from 'consola'

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body as IUser
    if(!email || !username || !password) return res.json({ message: 'Write all fields' })

    const emailExist = await UserModel.findOne({ email })
    if(emailExist) return res.json({ error: 'This Email already registered' })

    const usernameExist = await UserModel.findOne({ username })
    if(usernameExist) return res.json({ error: 'This Username already registered' })

    const user: IUser = new UserModel({ 
      email, username, password
    })
    await user.save();
    return res.json({ message: 'User created' }).status(201)
  } catch (error) {
    res.json({ error: error.message }).status(500)
  }
}


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as IUser
    const user = await UserModel.findOne({ email })

    if(!user) return res.json({ error: 'Email or/and password are wrong' })
    if(!await comparePassword(password, user.get('password', null, { getters: false }))) return res.json({ error: 'Email or/and password are wrong' }) 

    const accessToken = await signAccessToken(String(user._id))
    const refreshToken = await signRefreshToken(String(user._id))

    // res.cookie(Token.ACCESS_TOKEN, accessToken)
    // res.cookie(Token.REFRESH_TOKEN, refreshToken)

    res.json({ data: { accessToken, refreshToken, user }})
  } catch (error) {
    res.json({ error: error.message }).status(500)
  }
} 

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    // const refreshToken = req.cookies(Token.REFRESH_TOKEN)
    if(!refreshToken) return res.json({ error: 'no refresh token' })
    const userId = await verifyRefreshToken(refreshToken) as string

    client.del(userId)
    // res.clearCookie(Token.ACCESS_TOKEN)
    // res.clearCookie(Token.REFRESH_TOKEN)

    return res.json({ message: 'successfully logout' }).status(204)
  } catch (error) {
    res.json({ error: error.message })
  }
}

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    // const refreshToken = req.cookies(Token.REFRESH_TOKEN)

    if(!refreshToken) return res.json({ error: 'no refresh token' })
    const userId = await verifyRefreshToken(refreshToken) as string

    const accessToken = await signAccessToken(userId)
    const refToken = await signRefreshToken(userId)

    const user = await UserModel.findById(userId)

    return res.json({ data: { accessToken, refreshToken: refToken, user }})
  } catch (error) {
    consola.error({ message: `Unauthorized request: IP-${req.ip}` })   
    res.status(401).json({ error: error.message })
  }
}