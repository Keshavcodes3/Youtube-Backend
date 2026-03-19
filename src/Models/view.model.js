import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
    
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

    ipAddress: {
        type: String
    },

    watchTime: {
        type: Number, 
        default: 0
    }

}, { timestamps: true });

const viewModel = mongoose.model("View", viewSchema);

export default viewModel;