import videoModel from "../Models/video.model";
import commentModel from "../Models/comment.model";

export const createComment = async (req, res) => {
    try {
        const videoId = req.params.id
        const userId = req.user.id
        const { content, parentComment } = req.body
        if (!content) {
            return res.status(400).json({
                message: "Content must provide to create a comment",
                success: false
            })
        }
        const doVideoExist = await videoModel.findById(videoId)
        if (!doVideoExist) {
            return res.status(201).json({
                message: "Video doesn't exist",
                success: false
            })
        }

        const comment = await commentModel.create({
            userId, videoId, content,
            parentComment: parentComment || null
        })
        return res.status(201).json({
            message: "Comment added",
            success: true,
            data: comment
        });
    } catch (err) {
        return res.status(400).json({
            message: `Something error occured !! ${err.message}`,
            success: false
        })
    }
}


export const deleteComment = async (req, res) => {
    try {
        const videoId = req.params.videoId
        const userId = req.user.id
        const commentId = req.params.commentId
        const doVideoExist = await videoModel.findOne({ _id: videoId })
        if (!doVideoExist) {
            return res.status(404).json({
                message: "Video doesn't exist",
                success: false
            })
        }
        const commentExist = await commentModel.findById(commentId)
        if (!commentExist) {
            return res.status(404).json({
                success: false,
                message: "Comment doest not exist"
            })
        }
        if (commentExist.parentComment == commentId) {
            await commentModel.deleteMany({ parentComment: parentComment })
            await commentModel.findByIdAndDelete(parentComment)
        }
        await commentModel.findByIdAndDelete(commentId)
        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        })


    } catch (err) {
        return res.status(400).json({
            message: `Error : ${err.message}`
        })
    }
}

export const editComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "Content is required",
                success: false
            });
        }

        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
                success: false
            });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).json({
            message: "Comment updated",
            success: true,
            data: comment
        });

    } catch (err) {
        return res.status(400).json({
            message: err.message,
            success: false
        });
    }
};



export const getAllComment = async (req, res) => {
    try {
        const videoId = req.params.id
        const Video = await videoModel.findById(videoId)
        if (!Video) {
            return res.status(404).json({
                message: "Video not found !!"
            })
        }
        const page = parseInt(req.query.page || 1)
        const limit = parseInt(req.query.limit || 5)
        const skip = (page - 1) * limit
        const allComments = await commentModel.find({
            videoId: videoId,
            parentComment: null
        }).sort({ createdAt: -1 }).limit(limit).skip(skip).populate('userId', 'channelName logoUrl')
        if (!allComments) {
            return res.status(200).json({
                success: true,
                message: "No comments found"
            })
        }
        const total = await commentModel.countDocuments({ videoId: videoId, parentComment: null })
        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            data: allComments,
            hasMore: skip + allComments.length < total
        });

    } catch (err) {
        return res.status(400).json({
            message: err.message,
            success: false
        });
    }
}



export const postReply = async (req, res) => {
    try {
        const userId = req.user.id
        const { content } = req.body
        const parentId = req.params.parentId
        const parentComment = await commentModel.findById(parentId)
        if (!parentComment) {
            return res.status(404).json({
                success: false,
                message: "Parent comment not found"
            });
        }
        const reply = await commentModel.create({
            userId, videoId: parentComment.videoId,
            content,
            parentComment: parentId
        })
        const page=parseInt(req.query.page || 1)
        const limit=parseInt(req.query.limit || 5)
        const skip=(page-1)*limit
        const replydetails=await reply.sort({createdAt:-1}).limit(limit).page(page).populate('userId','logoUrl channelName')
        const total=await commentModel.countDocuments({parentComment:parentId})
        return res.status(201).json({
            success: true,
            message: "Reply posted successfully",
            data: replydetails,
            hasMore:skip+replydetails.length<total
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}



export const getAllReply = async (req, res) => {
    try {
        const parentId=req.params.parentId;
        const parentComment=await commentModel.findOne({parentComment:parentId})
        if(!parentComment){
            return res.status(404).json({
                message:"No comment found",
                success:false
            })
        }
        const page=parseInt(req.query.page || 1)
        const limit=parseInt(req.query.limit || 5)
        const skip=(page-1)*limit
        const total=await commentModel.countDocuments({parentComment:parentId})
        const allreplies=await commentModel.find({parentComment:parentId}).sort({createdAt:-1}).limit(limit).page(page)
        if(allreplies.countDocuments==0){
            return res.status(200).json({
                message:"No reply found",
                success:true
            })
        }
        return res.status(200).json({
            message:"All reply fetched",
            data:allreplies,
            hasMore:skip+allreplies.length <total
        })

    } catch (err) {
        return res.status(201).json({
            success: false,
            message: `Error : ${err.message}`,
           
        });
    }
}