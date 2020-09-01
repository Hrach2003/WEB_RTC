import http from 'http'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import consola from 'consola'
import { ExpressPeerServer } from 'peer'

import redis from 'redis'

import { registerAdminPanel } from './admin/admin.routes'
import { connectToDB } from "./helpers/DB";


import dotenv from 'dotenv'
dotenv.config()

const app = express()
const server = http.createServer(app);


;(async () => {
  try {
    const DB_connection = await connectToDB(process.env.DB as string);
    app.use(express.json())
    app.use(cookieParser());
    app.use(cors())

    const { router: Main } = await import('./routes/main.routes')
    app.use("/joinroom", Main)

    const { router: Auth } = await import('./User/auth/auth.routes')
    app.use('/auth', Auth)

    const { router: User } = await import('./User/user.routes')
    app.use('/user', User)

    const { router: Room } = await import('./Room/room.routes')
    app.use('/room', Room)

    const { router: Admin, path = '/admin' } = registerAdminPanel(DB_connection)
    app.use(path, Admin)  

    const { initWebSocket } = await import('./socket')
    initWebSocket(server)

  } catch (error) { 
    consola.error({ message: `Internal Server Error \n ${error}`, badge: true})
  }
})()


const PORT = process.env.PORT || 3000 as number 
server.listen(PORT, () => consola.success({ message: `server started on http://localhost:${PORT}`, badge: true }))