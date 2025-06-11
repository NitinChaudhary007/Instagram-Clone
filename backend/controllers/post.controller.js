import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    if (!image) {
      return res.status(400).json({
        message: "Image is required...",
        success: false,
      });
    }

    // image Upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileURI = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileURI);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      message: "Post retrieved ",
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      });

    return res.status(200).json({
      message: "Post retrieved ",
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKarneWalaId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not find",
        success: false,
      });
    }

    // like Logic
    await post.updateOne({ $addToSet: { likes: likeKarneWalaId } });
    await post.save();

    // Socket IO for RTC
    const user = await User.findById(likeKarneWalaId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKarneWalaId) {
      // emit a notification event
      const notification = {
        type: "like",
        userId: likeKarneWalaId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnewSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnewSocketId).emit("notification", notification);
    }

    return res.status(201).json({
      message: "Post liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeKarneWalaId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not find",
        success: false,
      });
    }

    // like Logic
    await post.updateOne({ $pull: { likes: likeKarneWalaId } });
    await post.save();

    // Socket IO for RTC
    const user = await User.findById(likeKarneWalaId).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKarneWalaId) {
      // emit a notification event
      const notification = {
        type: "dislike",
        userId: likeKarneWalaId,
        userDetails: user,
        postId,
        message: "Your post was disliked",
      };
      const postOwnewSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnewSocketId).emit("notification", notification);
    }

    return res.status(201).json({
      message: "Post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKarneWalaId = req.id;

    const { text } = req.body;
    console.log(postId);

    const post = await Post.findById(postId);

    if (!text) {
      return res.status(400).json({
        message: "text required",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      author: commentKarneWalaId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );

    if (!comments) {
      return res.status(400).json({
        message: "No comments found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Comments found",
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    // check if the logged-in user is the author of post
    if (authorId !== post.author.toString()) {
      return res.status(403).json({
        message: "Unauthorized user",
        success: false,
      });
    }

    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the ref of post from user's account
    const user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    // delete associated comments of post
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // already exists in bookmarks remove post
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();

      return res.status(200).json({
        type: "unsave",
        message: "Post removed from bookmarks",
        success: true,
      });
    } else {
      // does not exists in bookmarks add post
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();

      return res.status(200).json({
        type: "save",
        message: "Post added to bookmarks",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
