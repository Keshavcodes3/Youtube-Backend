import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },

    likesCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;