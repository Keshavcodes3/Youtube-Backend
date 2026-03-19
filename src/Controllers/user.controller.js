import getDataUri from '../Utils/DataUri';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendEmailToUser } from '../Services/sendEmail';
import cloudinary from '../Utils/cloudinary';
import userModel from '../Models/user.model';
import channelModel from '../Models/channelModel';


/**
 * @desc Register a new user with channel details and logo upload.
 *       Uploads logo to Cloudinary, creates user + default channel,
 *       generates JWT token, and sends welcome email.
 * @route POST /api/auth/register
 * @access public
 */
export async function userRegisterController(req, res) {
    try {

        const { channelName, phone, email, password, logoUrl, logoId, subscribers } = req.body;
        const doUserAlreadyExist = await userModel.findOne({
            $or: [{ channelName }, { phone }, { email }]
        })
        if (doUserAlreadyExist) {
            return res.status(200).json({
                message: "Email or channelName already existed"
            })
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Logo is required"
            })
        }
        const fileUri = getDataUri(req.file)

        const uploadedImage = await cloudinary.uploader.upload(fileUri, {
            folder: "logos"
        })
        const newUser = await userModel.create({
            channelName,
            phone,
            email,
            password,
            logoUrl: uploadedImage.secure_url,
            logoId: uploadedImage.public_id,
            subscribers
        })
        const channelDetails = await channelModel.create({
            channelName,
            owner: newUser._id,
            logoUrl: uploadedImage.secure_url,
            logoId: uploadedImage.public_id,
        })
        newUser.activechannel = channelDetails._id
        newUser.save()

        const token = jwt.sign(
            { id: newUser._id, channelName: newUser.channelName },
            process.env.JWT_SECRET,
            { expiresIn: '5d' })
        res.cookie("token", token)
        sendEmailToUser(newUser)
        return res.status(201).json({
            success: true,
            message: "user registered successfully",
            user: newUser,
            channelDetails,
            token
        })


    } catch (err) {
        console.log(err)
        return res.status(400).json({
            success: false,
            message: err
        })
    }
}




/**
 * @desc Authenticate user using email or phone and password.
 *       Verifies credentials, fetches user channels,
 *       sets active channel and returns JWT token.
 * @route POST /api/auth/login
 * @access protected
 */


export async function userLoginController(req, res) {
    try {
        const { email, phone, password } = req.body;
        if ((!email && !phone) || !password) {
            return res.status(400).json({
                success: false,
                message: "email and phone or password is required"
            })
        }
        const user = await userModel.findOne({
            $or: [{ email }, { phone }]
        }).select('+password')
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found,check your credential again"
            })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Invalid Password , try again",
            })
        }
        const channels = await channelModel.find({
            owner: user._id
        }).select('channelName').lean().populate({ path: '_id', select: 'channelName logoUrl logoId' });

        let activechannel = user.activechannel;
        if (!activechannel && channels.length > 0) {
            user.activechannel = channels[0]._id
        }
        const token = jwt.sign({
            id: user._id,
            activechannel
        }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token)
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user, channels,
            activechannel
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}



export async function userUpdateAccount(req, res) {
    try {
        const userId = req.user.id
        const { channelName, email, phone, password } = req.body;
        if (!userId) {
            return res.status(401).json({
                message: "No user Id provided",
                success: false
            })
        }
        const User = await userModel.findById(userId)
        if (!User) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        if (channelName) {
            User.channelName = channelName
        }
        if (email) {
            User.email = email
        }
        if (phone) User.phone = phone
        if (password) {
            const newPassword = await bcrypt.hash(password, 10)
            User.password = newPassword
        }
        await User.save()
        return res.status(200).json({
            message: "Account updated successfully",
            success: true,
            data: {
                id: User._id,
                channelName: User.channelName,
                email: User.email,
                phone: User.phone,
            },
        });
    } catch (err) {
        return res.status(200).json({
            message: `Something went wrong ${err.message}`,
            success: false
        })
    }
}


/**
 * @desc Get all channels and description of the user who logged in
 * @route POST /api/v1/auth/getAllMychannel
 * @access private
 */



export async function getAllMychannels(req, res) {
    try {
        const channelDetails = await channelModel.find({
            owner: req.user.id
        })
        return res.status(200).json({
            success: true,
            message: "All channel fetched successfully",
            channelDetails
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Err : ${err}`
        })
    }
}

