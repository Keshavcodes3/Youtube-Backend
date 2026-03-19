import express from 'express'
import cookie from 'cookie-parser'
import userRouter from './Routes/user.routes'
import channelRouter from './Routes/channel.routes'
import videoRouter from './Routes/video.routes'
import commentRouter from './Routes/comment.routes'
const App=express()
App.use(express.json())
App.use(cookie())


/**
 * @desc User and Channel routes
 *       Handles authentication, user login/register,
 *       and channel creation/deletion APIs.
 * @baseRoute /api/v1/user
 */
App.use('/api/v1/auth', userRouter)


/**
 * @desc Handles channel creation API endpoints
 * @baseRoute /api/v1/channel
 */

App.use('/api/v1/channel',channelRouter)

App.use('/api/v1/videos', videoRouter)
App.use('/api/v1/comments', commentRouter)



export default App