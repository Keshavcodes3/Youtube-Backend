import express from "express";
import {
    uploadVideo,
    getMyAllVideos,
    getAllVideos, likeOrDislikeVideo
} from "../Controllers/video.controller.js";

import { IdentifyUser } from "../Middlewares/verifyUser.js";
import upload from "../Middlewares/multer.js";

const router = express.Router();

/**
 * @route   POST /api/videos/:channelId
 * @desc    Upload video to a specific channel
 * @access  Private
 */
router.post(
    "/:channelId",
    IdentifyUser,
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
);

/**
 * @route   GET /api/videos
 * @desc    Get all videos (feed)
 * @access  Public
 */
router.get(`/vidoes`, getAllVideos);

/**
 * @route   GET /api/videos/my-videos
 * @desc    Get User all videos
 * @access  Public
 */
router.get("/my-videos", getMyAllVideos);


router.post("/like/:videoId", IdentifyUser, likeOrDislikeVideo)


export default router;