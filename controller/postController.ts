import { Request, Response } from "express";
import userModel from "../model/userModel";
import { streamUpload } from "../config/streamifier";
import postModel from "../model/postModel";

export const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const { text } = req.body;

    // Verify if the user exists
    const user: any = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Upload image if provided
    let secure_url = null;
    let public_id = null;

    if (req.file) {
      const uploadResult = await streamUpload(req);

      // Destructure only if uploadResult is not null
      if (uploadResult) {
        secure_url = uploadResult.secure_url;
        public_id = uploadResult.public_id;
      }
    }

    // Create post with or without image
    const post = await postModel.create({
      text,
      authorId: userId,
      image: secure_url, // null if no image is uploaded
      imageId: public_id, // null if no image is uploaded
    });

    user?.posts?.push(post?._id);
    user.save();

    return res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error: any) {
    console.error("Error in createPost:", error); // Debugging log
    return res.status(500).json({
      message: "Internal server error",
      data: error.message,
    });
  }
};

export const getOnePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId } = req.params;

    const post = await postModel
      .findById(postId)
      .populate("authorId") // Populate the authorId with selected fields
      .populate("comments"); // Populate the comments path

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId, userId } = req.params;
    const { text } = req.body;

    // Retrieve the post and user
    const post: any = await postModel.findById(postId);
    const user = await userModel.findById(userId);

    if (!user || !post) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Handle image upload only if provided
    let secure_url = null;
    let public_url = null;

    if (req.file) {
      const uploadResult = await streamUpload(req);
      if (uploadResult) {
        secure_url = uploadResult.secure_url;
        public_url = uploadResult.public_id;
      }
    }

    // Prepare the updated post data
    const updateData: any = { text };

    // Add image fields if an image is uploaded
    if (secure_url && public_url) {
      updateData.image = secure_url;
      updateData.imageId = public_url;
    }

    // Update the post with the new data
    const updatedPost = await postModel.findByIdAndUpdate(postId, updateData, {
      new: true, // To return the updated post
    });

    // Check if the user is the post's author
    if (userId.toString() === post.authorId.toString()) {
      return res.status(200).json({
        message: "Post updated successfully",
        data: updatedPost,
      });
    } else {
      return res.status(403).json({
        message: "Action cannot be performed",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId, userId } = req.params;

    // Retrieve the post and user
    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId);

    if (!user || !post) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Check if the user is the author of the post
    if (userId.toString() === post?.authorId.toString()) {
      // Delete the post from the postModel
      await postModel.findByIdAndDelete(postId);

      // Remove the post from the user's posts array
      user.posts = user.posts.filter(
        (postId: any) => postId.toString() !== postId.toString()
      );

      // Save the updated user document
      await user.save();

      return res.status(200).json({
        message: "Post deleted successfully",
      });
    } else {
      return res.status(403).json({
        message: "Action cannot be performed",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const getAllPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const posts = await postModel.find().populate("comments");

    return res.status(200).json({
      message: `${posts?.length} post(s) gotten`,
      data: posts,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const likePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId, userId } = req.params;

    // Find the post and user by their IDs
    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId);

    // Check if the user or post doesn't exist
    if (!user || !post) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({
        message: "You have already liked this post",
      });
    }

    // Add the user's ID to the post's likes array
    post.likes.push(userId);
    await post.save();

    return res.status(200).json({
      message: "Post liked successfully",
      data: post.likes, // Return the number of likes
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};

export const unlikePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId, userId } = req.params;

    // Find the post and user by their IDs
    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId);

    // Check if the user or post doesn't exist
    if (!user || !post) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    // Check if the user has not liked the post yet
    if (!post.likes.includes(userId)) {
      return res.status(400).json({
        message: "You have not liked this post",
      });
    }

    // Remove the user's ID from the post's likes array
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();

    return res.status(200).json({
      message: "Post unliked successfully",
      data: post.likes, // Return the number of likes
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error?.message,
    });
  }
};
