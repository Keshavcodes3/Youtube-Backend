import mongoose from "mongoose"

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }
}, { timestamps: true })


likeSchema.index({videoId:1,userId:1},{unique:true})

const likeModel=mongoose.model("Likes",likeSchema)


export default likeModel

