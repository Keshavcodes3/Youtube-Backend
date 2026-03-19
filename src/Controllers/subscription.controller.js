import userModel from "../Models/user.model";
import channelModel from "../Models/channelModel";
import videoModel from "../Models/video.model";



export const subscribeAndunsubscribeController = async (req, res) => {
    try {
        const userId = req.user.id;
        const channelId = req.params.channelId
        if (userId == channelId) {
            return res.status(400).json({
                success: false,
                messae: "You can't subscribe yourself"
            })
        }
        const user = await userModel.findById(userId)
        const channel = await channelModel.findById(channelId)
        if (!channel) {
            return res.status(404).json({
                message: "No channel found",
                success: false
            })
        }
        const alreadySubscribed = user.subscribedChannel.includes(channelId)
        if (alreadySubscribed) {
            //Unsubscribe
            user.subscribedChannel.pull(channelId)
            channel.subscribers = Math.max(channel.subscribers - 1, 0)
            await user.save()
            await channel.save()
        } else {
            //subscribe
            user.subscribedChannel.push(channelId)
            channel.subscribers += 1
            channel.subscribers = Math.max(channel.subscribers + 1, 0)
            await channel.save()
            await user.save()

        }
        return res.status(200).json({
            success: true,
            message: "Subscribed successfully"
        });

    } catch (err) {
        return res.status(400).json({
            message: `Something Error occred : ${err.message}`,
            success: false
        })
    }
}


export const subscribedChannel = async (req, res) => {
    try {
        const userId=req.user.userId;
        const channels=await userModel.findById(userId).populate('subscribedChannel')
        if(!channels){
            return res.status(404).json({
                success: false,
                message: "User not found or No subscribed channels"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Subscribed channels fetched successfully",
            channels: channels.subscribedChannel
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}