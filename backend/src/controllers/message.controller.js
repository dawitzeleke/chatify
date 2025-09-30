import Message from '../models/Message.js';
import User from '../models/User.js';


export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        res.status(200).json(filteredUsers);

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.error("Error fetching contacts:", error);
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.error("Error fetching messages:", error);
    }
}

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { text, image } = req.body;
        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }
        let imageUrl;
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            console.log("Uploaded image:", uploadedImage);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.error("Error sending message:", error);
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        const chatPartnerIds = new Set();
        messages.forEach(msg => {
            if (msg.senderId.toString() !== loggedInUserId.toString()) {
                chatPartnerIds.add(msg.senderId.toString());
            }
            if (msg.receiverId.toString() !== loggedInUserId.toString()) {
                chatPartnerIds.add(msg.receiverId.toString());
            }
        });

        const chatPartners = await User.find({ _id: { $in: Array.from(chatPartnerIds) } }).select('-password');
        res.status(200).json(chatPartners);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.error("Error fetching chat partners:", error);
    }
}