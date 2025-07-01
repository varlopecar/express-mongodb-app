import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "../models/Post";
import config from "../config";
import logger from "../config/logger";

// Load environment variables
dotenv.config();

const samplePosts = [
  {
    title: "Welcome to Our Blog",
    content:
      "This is the first blog post on our platform. We're excited to share interesting content with our readers. Stay tuned for more articles about technology, development, and best practices.",
    author: "Admin Team",
  },
  {
    title: "Getting Started with React",
    content:
      "React is a powerful JavaScript library for building user interfaces. In this post, we'll explore the basics of React components, state management, and hooks. Whether you're a beginner or experienced developer, there's something here for everyone.",
    author: "John Developer",
  },
  {
    title: "Docker Best Practices",
    content:
      "Docker has revolutionized how we deploy applications. Learn about Docker best practices including multi-stage builds, security considerations, and optimization techniques. We'll cover everything from basic concepts to advanced deployment strategies.",
    author: "Sarah DevOps",
  },
  {
    title: "API Design Principles",
    content:
      "Good API design is crucial for building scalable applications. We'll discuss RESTful principles, error handling, versioning strategies, and documentation best practices. These principles apply whether you're building microservices or monolithic applications.",
    author: "Mike Architect",
  },
  {
    title: "Testing Strategies for Modern Applications",
    content:
      "Testing is an essential part of software development. We'll explore different testing strategies including unit tests, integration tests, and end-to-end tests. Learn how to implement comprehensive testing that gives you confidence in your code.",
    author: "Lisa QA",
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI);
    logger.info("Connected to MongoDB for seeding");

    // Clear existing posts
    await Post.deleteMany({});
    logger.info("Cleared existing posts");

    // Insert sample posts
    const createdPosts = await Post.insertMany(samplePosts);
    logger.info(`Created ${createdPosts.length} sample blog posts`);

    // Display created posts
    createdPosts.forEach((post, index) => {
      logger.info(`Post ${index + 1}: ${post.title} by ${post.author}`);
    });

    logger.info("Database seeding completed successfully");
  } catch (error) {
    logger.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Run the seed function
seedDatabase();
