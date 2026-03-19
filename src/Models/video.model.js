import mongoose, { model } from "mongoose";

const videoSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    likesCount: {
        type: Number,
        default: 0
    },
    viewsCount: {
        type: Number,
        default: 0
    }

})



const videoModel = mongoose.model("Video", videoSchema)


export default videoModel