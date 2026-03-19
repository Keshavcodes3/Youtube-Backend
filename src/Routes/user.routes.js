import express from 'express'
import upload from '../Middlewares/multer'
import { userRegisterController,userLoginController,getAllMychannels } from '../Controllers/user.controller';
import {validateRegister} from '../Validator/authValidator.js'
import {createChannel,deleteChannel} from '../Controllers/channel.controller.js'
import {IdentifyUser} from '../Middlewares/verifyUser.js'
import {userUpdateAccount} from '../Controllers/user.controller.js'
const userRouter=express.Router()


userRouter.post('/register',upload.single("logo"),validateRegister,userRegisterController)

userRouter.post('/login',userLoginController)

userRouter.get('/me',IdentifyUser,getAllMychannels)


userRouter.patch('/edit',IdentifyUser,userUpdateAccount)


export default userRouter