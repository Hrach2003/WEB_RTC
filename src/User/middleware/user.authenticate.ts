import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verifyAccessToken } from "../../helpers/JWT.helper";
import { IUser } from "../../_interfaces";
import consola from "consola";

export enum Token {
  REFRESH_TOKEN = 'refreshToken',
  ACCESS_TOKEN = 'accessToken'
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers['authorization']
    const TOKEN = authToken?.split(' ')[1]
    if(!TOKEN) return res.status(401).json(new createHttpError.Unauthorized)
    const user = await verifyAccessToken(TOKEN)
    req.user = user as IUser
    consola.info({ message: `User authorized: IP-${req.ip}` })   
    next()
  } catch (error) { 
    consola.error({ message: `Unauthorized request: IP-${req.ip}` })   
    res.status(401).json(new createHttpError.Unauthorized)
  }
}   