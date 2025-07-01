import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import Post from "../src/models/Post";

beforeEach(async () => {
  await Post.deleteMany({});
});

describe("Blog Posts API", () => {
  describe("GET /posts", () => {
    it("should return empty array when no posts exist", async () => {
      const response = await request(app).get("/posts");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all posts", async () => {
      await Post.create({
        title: "Test Post 1",
        content: "Test content 1",
        author: "Test Author 1",
      });

      await Post.create({
        title: "Test Post 2",
        content: "Test content 2",
        author: "Test Author 2",
      });

      const response = await request(app).get("/posts");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe("Test Post 2"); // Should be sorted by createdAt desc
      expect(response.body[1].title).toBe("Test Post 1");
    });
  });

  describe("GET /posts/:id", () => {
    it("should return 404 for non-existent post", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/posts/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Blog post not found");
    });

    it("should return post by id", async () => {
      const post = await Post.create({
        title: "Test Post",
        content: "Test content",
        author: "Test Author",
      });

      const response = await request(app).get(`/posts/${post._id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Test Post");
      expect(response.body.content).toBe("Test content");
      expect(response.body.author).toBe("Test Author");
    });
  });

  describe("POST /posts", () => {
    it("should create a new post", async () => {
      const postData = {
        title: "New Post",
        content: "New content",
        author: "New Author",
      };

      const response = await request(app)
        .post("/posts")
        .send(postData)
        .expect(201);

      expect(response.body.title).toBe(postData.title);
      expect(response.body.content).toBe(postData.content);
      expect(response.body.author).toBe(postData.author);
      expect(response.body._id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it("should return 400 for invalid data", async () => {
      const invalidData = {
        title: "", // Empty title
        content: "Valid content",
        author: "Valid author",
      };

      const response = await request(app)
        .post("/posts")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toBeDefined();
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        title: "Valid title",
        // Missing content and author
      };

      const response = await request(app)
        .post("/posts")
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
    });
  });

  describe("PUT /posts/:id", () => {
    it("should update an existing post", async () => {
      const post = await Post.create({
        title: "Original Title",
        content: "Original content",
        author: "Original author",
      });

      const updateData = {
        title: "Updated Title",
        content: "Updated content",
        author: "Updated author",
      };

      const response = await request(app)
        .put(`/posts/${post._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
      expect(response.body.author).toBe(updateData.author);
    });

    it("should return 404 for non-existent post", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        title: "Updated Title",
        content: "Updated content",
        author: "Updated author",
      };

      const response = await request(app)
        .put(`/posts/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Blog post not found");
    });
  });

  describe("DELETE /posts/:id", () => {
    it("should delete an existing post", async () => {
      const post = await Post.create({
        title: "Post to Delete",
        content: "Content to delete",
        author: "Author to delete",
      });

      const response = await request(app)
        .delete(`/posts/${post._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Blog post deleted successfully");

      // Verify post is deleted
      const deletedPost = await Post.findById(post._id);
      expect(deletedPost).toBeNull();
    });

    it("should return 404 for non-existent post", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/posts/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Blog post not found");
    });
  });

  describe("Health check", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Blog API Server is running");
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.environment).toBeDefined();
    });
  });
});
