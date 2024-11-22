import { Request, Response } from "express";
import postModel from "../model/postModel";
import userModel from "../model/userModel";
import commentModel from "../model/commentModel";

export const createComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId, userId } = req.params;
    const { text } = req.body;

    const post: any = await postModel.findById(postId).populate("");
    const user = await userModel.findById(userId).populate("");

    // Check if the user and post exist
    if (!user || !post) {
      return res.status(404).json({
        message: "User or Post not found",
      });
    }

    // Prevent the post creator from commenting on their own post
    if (userId.toString() === post.authorId.toString()) {
      return res.status(403).json({
        message: "You cannot comment on your own post",
      });
    }

    // Create the comment and associate it with the post
    const comment = await commentModel.create({ text, authorId: userId });
    post?.comments.push(comment?._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId, userId, commentId } = req.params;

    // Find the post, user, and comment
    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId);
    const comment = await commentModel.findById(commentId);

    // Check if the post, user, or comment exists
    if (!post || !user || !comment) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Check if the user is the comment author or the post author
    if (
      userId.toString() === comment?.authorId.toString() ||
      userId.toString() === post?.authorId.toString()
    ) {
      // Remove the comment from the post's comments array
      post.comments = post.comments.filter(
        (comments: any) => comments.toString() !== commentId.toString()
      );

      // Save the updated post
      await post.save();

      // Delete the comment from the comment model
      await commentModel.findByIdAndDelete(commentId);

      return res.status(200).json({
        message: "Comment deleted successfully",
      });
    } else {
      return res.status(403).json({
        message: "You are not authorized to delete this comment",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const likeComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { commentId, userId } = req.params;

    // Find the comment and user by their IDs
    const comment = await commentModel.findById(commentId).populate("authorId");
    const user = await userModel.findById(userId);

    // Check if the user or comment doesn't exist
    if (!user || !comment) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      return res.status(400).json({
        message: "You have already liked this comment",
      });
    }

    // Add the user's ID to the comment's likes array
    comment.likes.push(userId);
    await comment.save();

    return res.status(200).json({
      message: "Comment liked successfully",
      data: comment.likes,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const unlikeComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { commentId, userId } = req.params;

    // Find the comment and user by their IDs
    const comment = await commentModel.findById(commentId).populate("authorId");
    const user = await userModel.findById(userId);

    // Check if the user or comment doesn't exist
    if (!user || !comment) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Remove the user's ID from the comment's likes array
    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    await comment.save();

    return res.status(200).json({
      message: "Comment unliked successfully",
      data: comment.likes,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};
