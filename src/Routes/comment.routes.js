import express from 'express'

import commentModel from '../Models/comment.model'

import { createComment,getAllComment,postReply, deleteComment, editComment,getAllReply } from '../Controllers/comment.controller'
import { IdentifyVideo } from '../Middlewares/Comment'
import { IdentifyUser } from '../Middlewares/verifyUser'
const commentRouter = express.Router()

commentRouter.post('/createcomment', IdentifyUser, IdentifyVideo, createComment)

commentRouter.delete('/deletecomment/:commentId', IdentifyUser, IdentifyVideo, deleteComment)
commentRouter.put('/editcomment/:commentId', IdentifyUser, IdentifyVideo, editComment)

commentRouter.get('/gelAllComment/:id',IdentifyUser,getAllComment)

commentRouter.post('/postReply/:parentId',IdentifyUser,postReply)


commentRouter.get('/getAllReply/:parentId',IdentifyUser,getAllReply)

export default commentRouter