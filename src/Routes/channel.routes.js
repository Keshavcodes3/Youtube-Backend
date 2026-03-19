import express from 'express'
import upload from '../Middlewares/multer'
import {getAllMychannels } from '../Controllers/user.controller';
import {createChannel,deleteChannel} from '../Controllers/channel.controller.js'
import {IdentifyUser} from '../Middlewares/verifyUser.js'
import {getchannelBySearch} from '../Controllers/channel.controller.js'
import {getAllChannels} from '../Controllers/channel.controller.js'
import { subscribeAndunsubscribeController } from '../Controllers/subscription.controller.js';
import {subscribedChannel} from '../Controllers/subscription.controller.js'
const channelRouter=express.Router()


channelRouter.get('/me',IdentifyUser,getAllMychannels)

channelRouter.post('/createChannel',IdentifyUser,upload.single("logo"),createChannel)

channelRouter.delete('/:channelId',IdentifyUser,deleteChannel)

channelRouter.get('/',getAllChannels)

channelRouter.get('/search/:channelId',getchannelBySearch)

channelRouter.post('/subscribe/:channelId',IdentifyUser,subscribeAndunsubscribeController)

channelRouter.get('/subscribe/getsubscribed',IdentifyUser,subscribedChannel)


export default channelRouter