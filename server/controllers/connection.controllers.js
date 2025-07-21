import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../index.js";

// send Connection Controller
export const sendConnection = async (req, res) => {
    try {
        let { id } = req.params;
        let sender = req.userId;
        let user = await User.findById(sender);

        if (sender == id) {
            return res.status(400).json({ message: "you cannot send request yourself" });
        }
        if (user.connection.includes(id)) {
            return res.status(400).json({ message: "you are already connected" });
        }

        let existingConnection = await Connection.findOne({
            sender,
            receiver: id,
            status: "pending",
        });

        if (existingConnection) {
            return res.status(400).json({ message: "request already exist" });
        }

        let newRequest = await Connection.create({
            sender,
            receiver: id,
        });

        // Add Socket Functionailty
        let receiverSocketId = userSocketMap.get(id);
        let senderSocketId = userSocketMap.get(sender);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusUpdate", { updatedUserId: sender, newStatus: "received" });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: id, newStatus: "pending" });
        }

        return res.status(200).json(newRequest);
    } catch (error) {
        return res.status(500).json({ message: `send Connection error ${error}` });
    }
}

// accept Connection Controller
export const acceptConnection = async (req, res) => {
    try {
        let { connectionId } = req.params;
        let connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(400).json({ message: "connection does not exist" });
        }
        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" });
        }

        connection.status = "accepted";
        await connection.save();

        await User.findByIdAndUpdate(req.userId, {
            $addToSet: {
                connection: connection.sender._id,
            }
        });

        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet: {
                connection: req.userId,
            }
        });

        return res.status(200).json({ message: "connection accepted" });
    } catch (error) {
        return res.status(500).json({ message: `connection accepted error ${error}` })
    }
}

// reject Connection Controller
export const rejectConnection = async (req, res) => {
    try {
        let { connectionId } = req.params;
        let connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(400).json({ message: "connection does not exist" });
        }
        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" });
        }

        connection.status = "rejected";
        await connection.save();

        // Add Socket Functionailty
        let receiverSocketId = userSocketMap.get(connection.receiver._id.toString());
        let senderSocketId = userSocketMap.get(connection.sender._id.toString());

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusUpdate", { updatedUserId: connection.sender._id, newStatus: "disconnect" });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: req.userId, newStatus: "disconnect" });
        }

        return res.status(200).json({ message: "connection rejected" });
    } catch (error) {
        return res.status(500).json({ message: `connection rejected error ${error}` })
    }
}

// getConnection status Controller
export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.userId;

        let currentUser = await User.findById(currentUserId);
        if (currentUser.connection.includes(targetUserId)) {
            return res.json({ status: "disconnect" });
        }

        const pendingRequest = await Connection.findOne({
            $or: [
                { sender: currentUserId, receiver: targetUserId },
                { sender: targetUserId, receiver: currentUserId },
            ],
            status: "pending",
        });

        if (pendingRequest) {
            if (pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({ status: "pending" });
            } else {
                return res.json({ status: "received", requestId: pendingRequest._id });
            }
        }

        // if no connection or pending request found
        return res.json({ status: "connect" });
    } catch (error) {

    }
}

// remove Connection Controller
export const removeConnection = async (req, res) => {
    try {
        const myId = req.userId;
        const otherUserId = req.params.userId;

        await User.findByIdAndUpdate(myId, { $pull: { connection: otherUserId } });
        await User.findByIdAndUpdate(otherUserId, { $pull: { connection: myId } });

        // Add Socket Functionailty
        let receiverSocketId = userSocketMap.get(otherUserId);
        let senderSocketId = userSocketMap.get(myId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusUpdate", { updatedUserId: myId, newStatus: "connect" });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updatedUserId: otherUserId, newStatus: "connect" });
        }

        return res.json({ message: "Connection removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "remove Connection error" });
    }
}

// Show All connection Collection
export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.userId;

        const requests = await Connection.find({
            receiver: userId,
            status: "pending",
        }).populate("sender", "firstName lastName email userName profileImage headline");

        return res.status(200).json(requests);
    } catch (error) {
        console.error("Error in getConnection Requests controller:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

// get All user Connetion

export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate(
            "connection",
            "firstName lastName userName profileImage headline connection"
        )

        return res.status(200).json(user.connection);
    } catch (error) {
        console.error("Error in getUser Connections controller:", error);
        return res.status(500).json({ message: "Server error" });
    }
}