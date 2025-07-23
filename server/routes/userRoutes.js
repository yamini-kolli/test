import express from 'express'
import {registerUser, loginUser,userCredits, restoreCredits} from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/credits',userAuth,userCredits)
userRouter.post('/add-credits', userAuth, restoreCredits);


export default userRouter

// https://localhost:4000/api/user/register
// https://localhost:4000/api/user/login