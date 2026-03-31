const express = require("express");
const chatRouter = express.Router();
const Chat = require("../models/chat");
const userAuth = require("../middleware/userAuth");
chatRouter.get("/chat/:targetUserId",userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate("messages.senderId", "firstName lastName");
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = chatRouter;