import { Router } from "express";
import { authenticateToken } from "./middleware/user.authenticate";
import { getUserInfo, getAllUsers } from "./user.controller";

const router = Router()

router.get('/', authenticateToken, getUserInfo)

export { router }