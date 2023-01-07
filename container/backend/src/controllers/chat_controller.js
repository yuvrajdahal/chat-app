import asyncHandler from "../middlewares/asyncHandler";
import Chat from "../models/chat_model";
import ErrorResponse from "../utils/ErrorResponse.js";

/**
 * @desc    Get Message
 * @route   GET /api/v1/chat?from=id&to=id
 * @access  Private
 */

export const getMessages = asyncHandler(async (req, res, next) => {
    const { from, to } = req.query;
    const messages = await Chat.find({
        chatUsers: {
            $all: [from, to],
        }
    }).populate("from").populate("to");
    res.status(201).json({
        success: true,
        data: messages
    })
});
/**
 * @desc    Create USER
 * @route   POST /api/v1/chat
 * @access  Private
 */
export const createMessage = asyncHandler(async (req, res, next) => {
    console.log("body", req.body)
    const { from, to, message } = req.body;
    const newMessage = await Chat.create({
        chatUsers: [from, to],
        from,
        to,
        message
    })
    res.status(201).json({
        success: true
    })
})
/**
 * @desc    DELETE USER
 * @route   DELETE /api/v1/users/:id
 * @access  Private
 */
export const deleteMessage = asyncHandler(async (req, res, next) => {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
        return next(
            new ErrorResponse(`Chat not found of id ${req.params.id}`, 404)
        );
    }
    chat.remove();

    res.status(201).json({
        success: true,
        data: chat,
    });
});

/**
 * @desc    UPDATE USER
 * @route   PUT /api/v1/update_user/:id
 * @access  Private
 */
export const updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
});
export const addPictures = asyncHandler(async (req, res, next) => {
    const { from, to, picture } = req.body;
    const newMessage = await Chat.create({
        chatUsers: [from, to],
        from,
        to,
        message: picture
    });
    res.status(200).json({
        success: true,
        data: newMessage,
    });
});
export const uploadImage = asyncHandler(async (req, res, next) => {
    res.send(`/${req.file.path}`);
})
