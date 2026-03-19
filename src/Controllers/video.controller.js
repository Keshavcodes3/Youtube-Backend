import channelModel from "../Models/channelModel";
import likeModel from "../Models/like.model";
import userModel from "../Models/user.model";
import videoModel from "../Models/video.model";
import cloudinary from "../Utils/cloudinary";


export const uploadVideo = async (req, res) => {
    try {
        const { title, description, channelId } = req.body;
        if (!req.file) {
            return res.status(400).json({
                message: "No video file provided"
            })
        }
        const channel = await channelModel.findById(channelId)
        if (!channel) {
            return res.status(400).json({
                message: "No channel provided",
                success: false
            })
        }
        if (channel.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to upload video to this channel"
            })
        }
        const fileUri = getDataUri(req.file)
        const uploadedVideo = await cloudinary.uploader.upload(fileUri, {
            resource_type: "video",
            folder: "videos"
        });
        const newVideo = await videoModel.create({
            title,
            description,
            channel: channelId,
            videoUrl: uploadedVideo.secure_url,
            thumbnailUrl: uploadedVideo.thumbnail_url
        });
        await newVideo.save();
        return res.status(201).json({
            message: "Video uploaded successfully",
            video: newVideo
        });

    } catch (err) {
        return res.status(400).json({
            message: `Something went wrong : ${err.message}`
        })
    }
}




export const getMyAllVideos = async (req, res) => {
    try {
        const userId = req.user.id
        const User = await userModel.findById(userId)
        if (!User) {
            return res.status(404).json({
                message: `User Not Found`
            })
        }
        const Mychannels = await channelModel.findById(userId).populate('owner', 'email logoUrl')
        if (!Mychannels) {
            return res.status(400).json({
                success: false,
                message: "You currently don't have any channel"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Your channel data fetched successully",
            video: Mychannels
        })

    } catch (err) {
        return res.status(409).json({
            success: false,
            message: `Something went wrong ${err.message}`
        })
    }
}

export const getAllVideos = async (req, res) => {
    try {
        const userId = req.user.id
        const User = await userModel.findById(userId)
        if (!User) {
            return res.status(409).json({
                message: "User Not authorized or Not found",
                success: false
            })
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limits) || 5
        const skip = (page - 1) * limit
        const allVideos = await channelModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('owner', 'channelName logoUrl subscribers')
        return res.status(200).json({
            message: "All videos fetched successfully",
            video: allVideos,
            page,
            hasMore: skip + allVideos.length < total
        })

    } catch (err) {
        return res.status(400).json({
            message: `Something wrong happend , ${err.message}`
        })
    }
}


export const likeOrDislikeVideo = async (req, res) => {
    try {
        const userId = req.user.id;
        const videoId = req.params.id
        if (!videoId) {
            return res.status(404).json({
                message: "No video opened",
                success: false
            })
        }
        const isVideoExist = await videoModel.findById(videoId)
        if (!isVideoExist) {
            return res.status(404).json({
                message: "Video doesn't exist",
                success: false
            })
        }
        const alreadyLiked = await likeModel.findOne({
            userId,
            videoId
        })
        if (alreadyLiked) {
            //Dislike Logic
            await likeModel.deleteOne({ _id: alreadyLiked._id })
            await videoModel.findByIdAndUpdate(videoId, { $inc: { likesCount: -1 } })
            return res.status(200).json({
                message: "Video disliked successfully",
                success: true
            })
        }
        else {
            //Like logic
            const LikeDetails = await likeModel.create({
                userId, videoId
            })
            await videoModel.findByIdAndUpdate(videoId, { $inc: { likesCount: 1 } })
            return res.status(200).json({
                message: "Video liked successfully",
                success: true,
                LikeDetails
            })
        }
    } catch (err) {
        return res.status(400).json({
            message: `Something went wrong !! ${err.message}`
        })
    }
}