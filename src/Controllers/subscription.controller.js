import userModel from "../Models/user.model";
import channelModel from "../Models/channelModel";
import videoModel from "../Models/video.model";



export const subscribeAndunsubscribeController = async (req, res) => {
    try {
        const userId = req.user.id;
        const channelId = req.params.channelId;

        if (userId === channelId) {
            return res.status(400).json({
                success: false,
                message: "You can't subscribe to yourself"
            });
        }

        const user = await userModel.findById(userId);
        const channel = await channelModel.findById(channelId);

        if (!channel) {
            return res.status(404).json({
                message: "No channel found",
                success: false
            });
        }

        const alreadySubscribed = user.subscribedChannel.some(
            id => id.toString() === channelId
        );

        if (alreadySubscribed) {
            // Unsubscribe
            user.subscribedChannel.pull(channelId);
            channel.subscribers = Math.max(channel.subscribers - 1, 0);
        } else {
            // Subscribe
            user.subscribedChannel.push(channelId);
            channel.subscribers += 1;
        }

        await user.save();
        await channel.save();
        return res.status(200).json({
            success: true,
            message: alreadySubscribed ? "Unsubscribed successfully" : "Subscribed successfully"
        });

    } catch (err) {
        return res.status(400).json({
            message: `Something Error occurred: ${err.message}`,
            success: false
        });
    }
};

export const subscribedChannel = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get logged-in user and populate subscribedChannel
        const user = await userModel.findById(userId)
            .populate('subscribedChannel', 'channelName logoUrl subscribers') // only necessary fields
            .select('-email -password -phone -createdAt -updatedAt -__v');
        if (!user || user.subscribedChannel.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subscribed channels found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Subscribed channels fetched successfully",
            channels: user.subscribedChannel
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};