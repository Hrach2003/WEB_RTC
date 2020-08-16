import { Router, Request, Response } from "express";
import { v4 } from 'uuid'
import { authenticateToken } from "../User/middleware/user.authenticate";


const router = Router()

router.get('/', authenticateToken, (req: Request, res: Response) => {
  res.redirect(`${req.originalUrl}/${v4()}`)
})

router.get('/:roomId', authenticateToken, (req, res) => {
  const roomId = req.params.roomId
  res.json({ data: {roomId}, message: 'room created' })
})
export { router }