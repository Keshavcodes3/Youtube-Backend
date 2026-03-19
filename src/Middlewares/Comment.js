import videoModel from "../Models/video.model";
import commentModel from "../Models/comment.model";
import userModel from "../Models/user.model";


export const IdentifyVideo = async (req, res, next) => {
    const doVideoExist = await videoModel.params.id
    if (!doVideoExist) {
        return res.status(201).json({
            message: "Video doesn't exist",
            success: false
        })
    }
    req.video=doVideoExist
    next()
}