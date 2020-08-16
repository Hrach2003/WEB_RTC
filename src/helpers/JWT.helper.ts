import JWT from 'jsonwebtoken'
import { client } from './init_nodeCache';
import createHttpError, { Unauthorized } from 'http-errors';


export const signAccessToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      {}, 
      process.env.ACCESS_SECRET_TOKEN as string,
      { expiresIn: '10s', audience: userId },
      (err, token) => {
        if(err) reject(err);
        resolve(token)
      }
    )
  }) 
} 

export const verifyAccessToken = (accessToken: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      accessToken, 
      process.env.ACCESS_SECRET_TOKEN as string, 
      (err, payload) => {
        if(err) reject(err);

        resolve(payload)
      }
    )
  })
}

export const signRefreshToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    JWT.sign(
      {}, 
      process.env.REFRESH_SECRET_TOKEN as string,
      { expiresIn: '7d', audience: userId },
      (err, token) => {
        if(err) reject(err);
        const success = client.set(userId, token as string, 365 * 24 * 60 * 60)

        success 
          ? resolve(token)
          : reject(new createHttpError.InternalServerError())
      }
    )
  }) 
}

export const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken, 
      process.env.REFRESH_SECRET_TOKEN as string, 
      (err, payload) => {
        if(err) reject(err);
        const { aud: userId } = payload as {aud: string}
        const result = client.get(userId)

        result === refreshToken
          ? resolve(userId)
          : reject(new Unauthorized())
      }
    )
  })
}