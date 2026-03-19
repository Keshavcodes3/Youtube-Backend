# YouTube Backend Application

A comprehensive RESTful API backend application built with Node.js and Express that provides functionality similar to YouTube. This application enables users to create channels, upload videos, and interact with content through comments and likes.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Channel Endpoints](#channel-endpoints)
  - [Video Endpoints](#video-endpoints)
  - [Comment Endpoints](#comment-endpoints)
- [Project Structure](#project-structure)

---

## Project Overview

This YouTube Backend Application is a full-featured REST API that handles the core functionality of a video streaming platform. It manages user authentication, channel creation and management, video uploads with cloud storage, and interactive features like comments and likes. The application uses MongoDB for data persistence and Cloudinary for media storage.

---

## Features

- **User Authentication**: Register and login with secure password hashing using bcryptjs
- **Channel Management**: Create, delete, and manage multiple channels
- **Video Management**: Upload videos with thumbnails, retrieve video feed
- **Subscriptions**: Subscribe/unsubscribe to channels and view subscribed channels
- **Comments & Replies**: Create, edit, delete comments, and post replies to comments
- **Like System**: Like or dislike videos
- **Search Functionality**: Search for channels and videos
- **JWT Authentication**: Secure endpoints with JWT token verification
- **File Upload**: Handle multiple file uploads using Multer with Cloudinary integration

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) & bcryptjs
- **File Upload**: Multer with Cloudinary
- **Email Service**: Nodemailer
- **Validation**: express-validator
- **Development**: tsx (TypeScript executor)

---

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Youtube-Backend-App
npm install
```

---

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
CLOUDINARY_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
EMAIL_USER=<your-email-address>
EMAIL_PASSWORD=<your-email-password>
```

---

## Running the Application

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:3000`

---

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

---

### Authentication Endpoints

#### **Register User**
- **Route**: `POST /auth/register`
- **Access**: Public
- **Description**: Register a new user account with their profile information and logo
- **Request**: 
  - Body: `email`, `password`, `name`
  - File: `logo` (profile image)
- **Response**: User object with JWT token

#### **Login User**
- **Route**: `POST /auth/login`
- **Access**: Public
- **Description**: Authenticate user credentials and return JWT token
- **Request**: 
  - Body: `email`, `password`
- **Response**: User object with JWT token and authentication cookie

---

### Channel Endpoints

#### **Get My Channels**
- **Route**: `GET /channel/me`
- **Access**: Private (Requires JWT)
- **Description**: Retrieve all channels created by the authenticated user
- **Response**: Array of channel objects

#### **Create Channel**
- **Route**: `POST /channel`
- **Access**: Private (Requires JWT)
- **Description**: Create a new channel for the authenticated user
- **Request**: 
  - Body: Channel details (name, description, etc.)
  - File: `logo` (channel logo/banner)
- **Response**: Newly created channel object

#### **Delete Channel**
- **Route**: `DELETE /channel/:channelId`
- **Access**: Private (Requires JWT)
- **Description**: Delete a specific channel by ID (user must be the channel owner)
- **Parameters**: `channelId` - The ID of the channel to delete
- **Response**: Success confirmation message

#### **Get All Channels**
- **Route**: `GET /channel`
- **Access**: Public
- **Description**: Retrieve all channels in the system (public feed)
- **Response**: Array of all channel objects

#### **Search Channel**
- **Route**: `GET /channel/search/:channelId`
- **Access**: Public
- **Description**: Search and retrieve details of a specific channel
- **Parameters**: `channelId` - The ID of the channel to search
- **Response**: Channel object with details

#### **Subscribe to Channel**
- **Route**: `POST /channel/:channelId`
- **Access**: Private (Requires JWT)
- **Description**: Subscribe to or unsubscribe from a channel (toggle functionality)
- **Parameters**: `channelId` - The ID of the channel to subscribe/unsubscribe
- **Response**: Updated subscription status

#### **Get Subscribed Channels**
- **Route**: `GET /channel/subscribed`
- **Access**: Private (Requires JWT)
- **Description**: Retrieve all channels that the authenticated user is subscribed to
- **Response**: Array of subscribed channel objects

---

### Video Endpoints

#### **Upload Video**
- **Route**: `POST /videos/:channelId`
- **Access**: Private (Requires JWT)
- **Description**: Upload a new video to a specific channel with video file and thumbnail
- **Parameters**: `channelId` - The ID of the channel where video will be uploaded
- **Request**: 
  - Files: `video`, `thumbnail`
  - Body: Video metadata (title, description, duration, etc.)
- **Response**: Newly uploaded video object

#### **Get All Videos (Feed)**
- **Route**: `GET /videos`
- **Access**: Public
- **Description**: Retrieve all videos for the user's feed/home page
- **Response**: Array of all video objects with metadata

#### **Get My Videos**
- **Route**: `GET /videos/my-videos`
- **Access**: Private (Requires JWT)
- **Description**: Retrieve all videos uploaded by the authenticated user
- **Response**: Array of user's video objects

#### **Like/Dislike Video**
- **Route**: `POST /videos/like/:videoId`
- **Access**: Private (Requires JWT)
- **Description**: Like or dislike a video (toggle functionality)
- **Parameters**: `videoId` - The ID of the video to like/dislike
- **Response**: Updated like status and like count

---

### Comment Endpoints

#### **Create Comment**
- **Route**: `POST /comments/createcomment`
- **Access**: Private (Requires JWT)
- **Description**: Create a new comment on a video
- **Request**: 
  - Headers: Video ID (from IdentifyVideo middleware)
  - Body: Comment text content
- **Response**: Newly created comment object with timestamp

#### **Delete Comment**
- **Route**: `DELETE /comments/deletecomment/:commentId`
- **Access**: Private (Requires JWT)
- **Description**: Delete a specific comment (user must be comment owner)
- **Parameters**: `commentId` - The ID of the comment to delete
- **Response**: Success confirmation message

#### **Edit Comment**
- **Route**: `PUT /comments/editcomment/:commentId`
- **Access**: Private (Requires JWT)
- **Description**: Update/edit the content of an existing comment
- **Parameters**: `commentId` - The ID of the comment to edit
- **Request**: 
  - Body: Updated comment text content
- **Response**: Updated comment object

#### **Get All Comments**
- **Route**: `GET /comments/gelAllComment/:id`
- **Access**: Private (Requires JWT)
- **Description**: Retrieve all comments on a specific video
- **Parameters**: `id` - The video ID
- **Response**: Array of comment objects for the video

#### **Post Comment Reply**
- **Route**: `POST /comments/postReply/:parentId`
- **Access**: Private (Requires JWT)
- **Description**: Reply to a specific comment or other replies
- **Parameters**: `parentId` - The ID of the parent comment
- **Request**: 
  - Body: Reply text content
- **Response**: Newly created reply object

#### **Get All Replies**
- **Route**: `GET /comments/getAllReply/:parentId`
- **Access**: Private (Requires JWT)
- **Description**: Retrieve all replies to a specific comment
- **Parameters**: `parentId` - The ID of the parent comment
- **Response**: Array of reply objects nested under the parent comment

---

## Project Structure

```
Youtube-Backend-App/
├── src/
│   ├── Config/              # Configuration files
│   │   ├── Database.js      # MongoDB connection
│   │   └── env.js           # Environment variables
│   ├── Controllers/         # Request handlers
│   │   ├── user.controller.js
│   │   ├── channel.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   └── subscription.controller.js
│   ├── Models/              # Database schemas
│   │   ├── user.model.js
│   │   ├── channel.model.js
│   │   ├── video.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   └── view.model.js
│   ├── Routes/              # API routes
│   │   ├── user.routes.js
│   │   ├── channel.routes.js
│   │   ├── video.routes.js
│   │   └── comment.routes.js
│   ├── Middlewares/         # Custom middleware
│   │   ├── verifyUser.js    # JWT authentication
│   │   ├── Comment.js       # Comment verification
│   │   └── multer.js        # File upload handler
│   ├── Services/            # Business logic services
│   │   ├── nodemailer.js
│   │   └── sendEmail.js
│   ├── Utils/               # Utility functions
│   │   ├── cloudinary.js    # Cloud storage integration
│   │   └── DataUri.js       # Data URI converter
│   ├── Validator/           # Input validation
│   │   └── authValidator.js
│   └── App.js               # Express app setup
├── Server.js                # Server entry point
├── package.json             # Dependencies
└── README.md                # Documentation
```

---

## Authentication

Most endpoints require JWT authentication. Include the JWT token in the request headers:

```
Authorization: Bearer <your-jwt-token>
```

Or use cookies if the token is stored as an HTTP-only cookie.

---

## Notes

- All file uploads are handled through Cloudinary for secure and scalable storage
- Passwords are hashed using bcryptjs for security
- User sessions are managed with JWT tokens
- The application supports nested comments and replies
- Video metadata includes view count, like count, and subscription count

---


**Version**: 1.0.0  
**Main Entry Point**: Server.js  
**API Version**: v1
