
import getDataUri from '../Utils/DataUri';
import cloudinary from '../Utils/cloudinary';
import userModel from '../Models/user.model';
import channelModel from '../Models/channelModel';




/**
 * @desc Create a new channel for the logged-in user
 *       and set it as the active channel.
 * @route POST /api/channel/:channelName
 * @access private
 */


export async function createChannel(req, res) {
    try {
        const userId = req.user.id;
        const { channelName } = req.body;
        const fileUri = getDataUri(req.file)

        const uploadedImage = await cloudinary.uploader.upload(fileUri, {
            folder: "logos"
        })

        if (!channelName) {
            return res.status(400).json({
                message: "No channel provided",
                success: false
            })
        }
        const newChannel = await channelModel.create({
            channelName,
            owner: userId,
            logoUrl: uploadedImage.secure_url,
            logoId: uploadedImage.public_id,
        })
        return res.status(201).json({
            message: "Channel created successfully",
            channelData: newChannel
        })
    } catch (err) {
        return res.status(400).json({
            message: `Error : ${err.message}`
        })
    }
}



/**
 * @desc Delete a channel owned by the logged-in user
 * @route DELETE /api/channel/:channelId
 * @access Private
 */

export async function deleteChannel(req, res) {
    try {
        const userID = req.user.id;
        const { channelId } = req.params
        const User = await channelModel.findOne({
            _id: channelId,
            owner: userID
        })
        const doChannelExist = await channelModel.findById(channelId).populate('channelName')
        if (!doChannelExist) {
            return res.status(404).json({
                success: false,
                message: "Unauthorized or No channel found with your id or name"
            })
        }
        if (!(User.owner == userID)) {
            return res.status(400).json({
                message: "Unauthorized access",
                success: false
            })
        }
        await channelModel.findByIdAndDelete(channelId)
        return res.status(200).json({
            success: true,
            message: `Channel with name ${doChannelExist.channelName} deleted successfully`
        })


    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Error : ${err.message}`
        })
    }
}



/**
 * @desc Get all channels with owner info
 * @route GET /api/channel
 * @access Public
 */

export async function getAllChannels(req, res) {
    try {
        const allchannels = await channelModel.find().populate({ path: "owner", select: "email" })
        return res.status(200).json({
            message: "All channel fetched successfully",
            channels: allchannels
        })
    } catch (err) {
        return res.status(500).json({
            message: `Err: ${err.message}`,
            success: false
        })
    }
}


export async function getchannelBySearch(req, res) {
    try {
        const channelId=req.params.channelId;
        const channel = await channelModel.findById(channelId).populate({ path: "owner", select: "email" })
        if (!channel) {
            return res.status(404).json({
                message: "Channel not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Channel fetched successfully",
            channel
        })
    } catch (err) {
        return res.status(500).json({
            message: `Err: ${err.message}`,
            success: false
        })
    }
}