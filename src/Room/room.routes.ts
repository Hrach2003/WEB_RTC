import { Router } from "express";
import { getAllRooms, joinRoom, createRoom, getUserCreatedRooms, getRoom } from "./room.controller";
import { authenticateToken } from "../User/middleware/user.authenticate";

const router = Router()

router.get('/', getAllRooms)
router.get('/join', authenticateToken, joinRoom)
router.get('/get-user-rooms', authenticateToken, getUserCreatedRooms)
router.post('/create', authenticateToken, createRoom)
router.get('/:name', authenticateToken, getRoom)
export { router }