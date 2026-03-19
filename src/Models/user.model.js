import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: [true, "Channel name is required to create an account"]
    },
    activeChannel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Channel"
    },
    phone: {
        type: String,
        required: [true, "Phone number is required to create an account"]
    },
    email: {
        type: String,
        required: [true, "Email is required to create an account"]
    },
    password: {
        type: String,
        required: [true, "Password is required to create an account"],
        select:false
    },
    logoUrl: {
        type: String,
        required: true
    },
    logoId: {
        type: String,
        required: true
    },
    subscribers: {
        type: Number,
        default: 0
    },
    subscribedChannel: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

}, { timestamps: true })


userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next;
    try{
        this.password=await bcrypt.hash(this.password,10)
        next
    }catch(err){
        console.log(err)
    }
})

const userModel = new mongoose.model("User", userSchema)
export default userModel

