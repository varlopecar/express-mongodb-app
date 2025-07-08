import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Post from "../models/Post";
import logger from "../config/logger";
import { ensureDBConnection } from "../config/database";

const router: Router = Router();

// Validation middleware
const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage("Content must be between 1 and 10000 characters"),
  body("author")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Author must be between 1 and 100 characters"),
];

// GET /posts - Get all blog posts
router.get("/", async (_req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const posts = await Post.find().sort({ createdAt: -1 });

    logger.info("Retrieved all blog posts", { count: posts.length });

    return res.status(200).json(posts);
  } catch (error) {
    logger.error("Error retrieving blog posts", { error });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /posts/:id - Get a specific blog post
router.get("/:id", async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const post = await Post.findById(req.params["id"]);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    logger.info("Retrieved blog post", { postId: req.params["id"] });

    return res.status(200).json(post);
  } catch (error) {
    logger.error("Error retrieving blog post", {
      error,
      postId: req.params["id"],
    });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /posts - Create a new blog post
router.post("/", validatePost, async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const { title, content, author } = req.body;

    const newPost = new Post({
      title,
      content,
      author,
    });

    const savedPost = await newPost.save();

    logger.info("Created new blog post", {
      postId: savedPost._id,
      title: savedPost.title,
      author: savedPost.author,
    });

    return res.status(201).json(savedPost);
  } catch (error) {
    logger.error("Error creating blog post", { error });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /posts/:id - Update a blog post
router.put("/:id", validatePost, async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const { title, content, author } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params["id"],
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    logger.info("Updated blog post", {
      postId: req.params["id"],
      title: updatedPost.title,
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    logger.error("Error updating blog post", {
      error,
      postId: req.params["id"],
    });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /posts/:id - Delete a blog post
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await ensureDBConnection();
    const deletedPost = await Post.findByIdAndDelete(req.params["id"]);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    logger.info("Deleted blog post", {
      postId: req.params["id"],
      title: deletedPost.title,
    });

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting blog post", {
      error,
      postId: req.params["id"],
    });
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
