import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    logoUrl: {
        type: String,
        required: true
    },
    logoId: {
        type: String,
        required: true
    },
    subscribers:{
        type:Number,
        default:0
    }
})



const channelModel = mongoose.model("Channel", channelSchema)


export default channelModel