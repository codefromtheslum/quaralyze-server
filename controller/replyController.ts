import { Request, Response } from "express";
import commentModel from "../model/commentModel";
import userModel from "../model/userModel";
import replyModel from "../model/replyModel";

export const createReply = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { commentId, userId } = req.params;
    const { text } = req.body;

    // Find the comment and user
    const comment: any = await commentModel.findById(commentId);
    const user = await userModel.findById(userId);

    // Check if comment or user exists
    if (!user || !comment) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Create the reply
    const reply = await replyModel.create({ text, authorId: userId });

    // Push the reply's _id into the comment's replies array
    comment.replies.push(reply._id); // Store the reply ID, not the user ID
    await comment.save();

    return res.status(201).json({
      message: "Reply sent",
      data: reply,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const deleteReply = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, replyId, commentId } = req.params;

    // Find the user, reply, and the comment to which the reply belongs
    const user = await userModel.findById(userId);
    const reply = await replyModel.findById(replyId);

    if (!user || !reply) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Find the comment that the reply is associated with
    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Check if the user is the author of the reply
    if (userId.toString() === reply.authorId.toString()) {
      // Remove the reply's ID from the comment's replies array
      comment.replies = comment.replies.filter(
        (replyId: any) => replyId.toString() !== replyId.toString()
      );
      await comment.save();

      // Delete the reply
      await replyModel.findByIdAndDelete(replyId);

      return res.status(200).json({
        message: "Reply deleted successfully",
      });
    } else {
      return res.status(403).json({
        message: "Not authorized",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const likeReply = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, replyId } = req.params;
    const user = await userModel.findById(userId);
    const reply = await replyModel.findById(replyId);

    if (!user || !reply) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Check if the user has already liked the reply
    if (reply.likes.includes(userId)) {
      return res.status(400).json({
        message: "You have already liked this reply",
      });
    }

    // Add user to the likes array and save the reply
    reply.likes.push(user?._id);
    await reply.save();

    return res.status(200).json({
      message: "Reply liked successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const unlikeReply = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, replyId } = req.params;
    const user = await userModel.findById(userId);
    const reply = await replyModel.findById(replyId);

    if (!user || !reply) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Remove the user from the likes array if they exist
    reply.likes = reply.likes.filter(
      (like: any) => like.toString() !== userId.toString()
    );
    await reply.save();

    return res.status(200).json({
      message: "Reply unliked successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};
