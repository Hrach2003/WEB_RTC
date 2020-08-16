import { Router } from "express";
import { createUser, loginUser, refreshAccessToken, logoutUser } from "./auth.controller";
import { userValidation, checkErrors } from "../middleware/user.validation";

const router = Router()

router.post('/signup', userValidation, checkErrors, createUser)
router.post('/signin', userValidation, checkErrors, loginUser)
router.post('/signout', logoutUser)
router.post('/token', refreshAccessToken)

export { router }