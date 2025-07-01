import dotenv from "dotenv";
import logger from "../config/logger";
import axios from "axios";

// Load environment variables
dotenv.config();

// API base URL - adjust this based on your server configuration
const API_BASE_URL = process.env["API_BASE_URL"] || "http://localhost:3000";

// Test data for creating posts
const testPosts = [
  {
    title: "API Testing Post 1",
    content:
      "This is the first test post for API testing. It contains sample content to verify that our API endpoints are working correctly.",
    author: "API Tester",
  },
  {
    title: "API Testing Post 2",
    content:
      "This is the second test post for API testing. We'll use this to test update and delete operations.",
    author: "Test User",
  },
  {
    title: "API Testing Post 3",
    content:
      "This is the third test post for API testing. This will help us verify that multiple posts can be retrieved and managed.",
    author: "Another Tester",
  },
  {
    title: "API Testing Post 4",
    content:
      "This is the fourth test post for API testing. We'll use this to test edge cases and validation.",
    author: "Edge Case Tester",
  },
  {
    title: "API Testing Post 5",
    content:
      "This is the fifth test post for API testing. This completes our test dataset for comprehensive API testing.",
    author: "Final Tester",
  },
];

// Invalid test data for validation testing
const invalidPosts = [
  {
    title: "", // Empty title - should fail validation
    content: "This post has an empty title",
    author: "Invalid Tester",
  },
  {
    title: "A".repeat(201), // Title too long - should fail validation
    content: "This post has a title that's too long",
    author: "Invalid Tester",
  },
  {
    title: "Missing Content",
    content: "", // Empty content - should fail validation
    author: "Invalid Tester",
  },
  {
    title: "Missing Author",
    content: "This post is missing an author",
    author: "", // Empty author - should fail validation
  },
];

interface TestResult {
  test: string;
  status: "PASS" | "FAIL";
  message: string;
  data?: any;
}

class APITester {
  private results: TestResult[] = [];
  private createdPostIds: string[] = [];

  async runTests() {
    logger.info("Starting comprehensive API tests...");

    try {
      // Test 1: Health Check
      await this.testHealthCheck();

      // Test 2: Root Endpoint
      await this.testRootEndpoint();

      // Test 3: Create Posts
      await this.testCreatePosts();

      // Test 4: Get All Posts
      await this.testGetAllPosts();

      // Test 5: Get Single Post
      await this.testGetSinglePost();

      // Test 6: Update Post
      await this.testUpdatePost();

      // Test 7: Validation Tests
      await this.testValidation();

      // Test 8: Delete Post
      await this.testDeletePost();

      // Test 9: Get Non-existent Post
      await this.testGetNonExistentPost();

      // Test 10: Update Non-existent Post
      await this.testUpdateNonExistentPost();

      // Test 11: Delete Non-existent Post
      await this.testDeleteNonExistentPost();

      // Clean up remaining test data
      await this.cleanupTestData();

      // Print results
      this.printResults();
    } catch (error) {
      logger.error("Error during API testing:", error);
      this.addResult(
        "Overall Test Suite",
        "FAIL",
        `Test suite failed: ${error}`
      );
    }
  }

  private addResult(
    test: string,
    status: "PASS" | "FAIL",
    message: string,
    data?: any
  ) {
    this.results.push({ test, status, message, data });
    logger.info(`[${status}] ${test}: ${message}`);
  }

  private async testHealthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      if (response.status === 200 && response.data.success) {
        this.addResult("Health Check", "PASS", "Health endpoint is working");
      } else {
        this.addResult(
          "Health Check",
          "FAIL",
          "Health endpoint returned unexpected response"
        );
      }
    } catch (error) {
      this.addResult("Health Check", "FAIL", `Health check failed: ${error}`);
    }
  }

  private async testRootEndpoint() {
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      if (response.status === 200 && response.data.success) {
        this.addResult("Root Endpoint", "PASS", "Root endpoint is working");
      } else {
        this.addResult(
          "Root Endpoint",
          "FAIL",
          "Root endpoint returned unexpected response"
        );
      }
    } catch (error) {
      this.addResult(
        "Root Endpoint",
        "FAIL",
        `Root endpoint test failed: ${error}`
      );
    }
  }

  private async testCreatePosts() {
    try {
      for (const postData of testPosts) {
        const response = await axios.post(`${API_BASE_URL}/posts`, postData);
        if (response.status === 201 && response.data._id) {
          this.createdPostIds.push(response.data._id);
          this.addResult(
            `Create Post: ${postData.title}`,
            "PASS",
            "Post created successfully"
          );
        } else {
          this.addResult(
            `Create Post: ${postData.title}`,
            "FAIL",
            "Post creation failed"
          );
        }
      }
    } catch (error) {
      this.addResult(
        "Create Posts",
        "FAIL",
        `Create posts test failed: ${error}`
      );
    }
  }

  private async testGetAllPosts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      if (response.status === 200 && Array.isArray(response.data)) {
        this.addResult(
          "Get All Posts",
          "PASS",
          `Retrieved ${response.data.length} posts`
        );
      } else {
        this.addResult("Get All Posts", "FAIL", "Get all posts failed");
      }
    } catch (error) {
      this.addResult(
        "Get All Posts",
        "FAIL",
        `Get all posts test failed: ${error}`
      );
    }
  }

  private async testGetSinglePost() {
    if (this.createdPostIds.length === 0) {
      this.addResult(
        "Get Single Post",
        "FAIL",
        "No posts available for testing"
      );
      return;
    }

    try {
      const postId = this.createdPostIds[0];
      const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
      if (response.status === 200 && response.data._id === postId) {
        this.addResult(
          "Get Single Post",
          "PASS",
          "Single post retrieved successfully"
        );
      } else {
        this.addResult("Get Single Post", "FAIL", "Get single post failed");
      }
    } catch (error) {
      this.addResult(
        "Get Single Post",
        "FAIL",
        `Get single post test failed: ${error}`
      );
    }
  }

  private async testUpdatePost() {
    if (this.createdPostIds.length === 0) {
      this.addResult("Update Post", "FAIL", "No posts available for testing");
      return;
    }

    try {
      const postId = this.createdPostIds[0];
      const updateData = {
        title: "Updated API Testing Post",
        content: "This post has been updated to test the PUT endpoint.",
        author: "Updated Tester",
      };

      const response = await axios.put(
        `${API_BASE_URL}/posts/${postId}`,
        updateData
      );
      if (response.status === 200 && response.data.title === updateData.title) {
        this.addResult("Update Post", "PASS", "Post updated successfully");
      } else {
        this.addResult("Update Post", "FAIL", "Post update failed");
      }
    } catch (error) {
      this.addResult(
        "Update Post",
        "FAIL",
        `Update post test failed: ${error}`
      );
    }
  }

  private async testValidation() {
    try {
      for (const invalidPost of invalidPosts) {
        try {
          await axios.post(`${API_BASE_URL}/posts`, invalidPost);
          this.addResult(
            `Validation Test: ${invalidPost.title || "Empty Title"}`,
            "FAIL",
            "Invalid post was accepted"
          );
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            this.addResult(
              `Validation Test: ${invalidPost.title || "Empty Title"}`,
              "PASS",
              "Validation correctly rejected invalid post"
            );
          } else {
            this.addResult(
              `Validation Test: ${invalidPost.title || "Empty Title"}`,
              "FAIL",
              `Unexpected error: ${error}`
            );
          }
        }
      }
    } catch (error) {
      this.addResult(
        "Validation Tests",
        "FAIL",
        `Validation tests failed: ${error}`
      );
    }
  }

  private async testDeletePost() {
    if (this.createdPostIds.length === 0) {
      this.addResult("Delete Post", "FAIL", "No posts available for testing");
      return;
    }

    try {
      const postId = this.createdPostIds[this.createdPostIds.length - 1];
      const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
      if (response.status === 200 && response.data.success) {
        this.addResult("Delete Post", "PASS", "Post deleted successfully");
        // Remove the deleted post ID from our list
        this.createdPostIds.pop();
      } else {
        this.addResult("Delete Post", "FAIL", "Post deletion failed");
      }
    } catch (error) {
      this.addResult(
        "Delete Post",
        "FAIL",
        `Delete post test failed: ${error}`
      );
    }
  }

  private async testGetNonExistentPost() {
    try {
      const fakeId = "507f1f77bcf86cd799439011"; // Valid MongoDB ObjectId format but non-existent
      await axios.get(`${API_BASE_URL}/posts/${fakeId}`);
      this.addResult(
        "Get Non-existent Post",
        "FAIL",
        "Should have returned 404"
      );
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        this.addResult(
          "Get Non-existent Post",
          "PASS",
          "Correctly returned 404 for non-existent post"
        );
      } else {
        this.addResult(
          "Get Non-existent Post",
          "FAIL",
          `Unexpected error: ${error}`
        );
      }
    }
  }

  private async testUpdateNonExistentPost() {
    try {
      const fakeId = "507f1f77bcf86cd799439011";
      const updateData = {
        title: "Updated Non-existent Post",
        content: "This should fail",
        author: "Test",
      };
      await axios.put(`${API_BASE_URL}/posts/${fakeId}`, updateData);
      this.addResult(
        "Update Non-existent Post",
        "FAIL",
        "Should have returned 404"
      );
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        this.addResult(
          "Update Non-existent Post",
          "PASS",
          "Correctly returned 404 for non-existent post"
        );
      } else {
        this.addResult(
          "Update Non-existent Post",
          "FAIL",
          `Unexpected error: ${error}`
        );
      }
    }
  }

  private async testDeleteNonExistentPost() {
    try {
      const fakeId = "507f1f77bcf86cd799439011";
      await axios.delete(`${API_BASE_URL}/posts/${fakeId}`);
      this.addResult(
        "Delete Non-existent Post",
        "FAIL",
        "Should have returned 404"
      );
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        this.addResult(
          "Delete Non-existent Post",
          "PASS",
          "Correctly returned 404 for non-existent post"
        );
      } else {
        this.addResult(
          "Delete Non-existent Post",
          "FAIL",
          `Unexpected error: ${error}`
        );
      }
    }
  }

  private async cleanupTestData() {
    try {
      // Delete any remaining test posts
      for (const postId of this.createdPostIds) {
        try {
          await axios.delete(`${API_BASE_URL}/posts/${postId}`);
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
      this.addResult("Cleanup", "PASS", "Test data cleanup completed");
    } catch (error) {
      this.addResult("Cleanup", "FAIL", `Cleanup failed: ${error}`);
    }
  }

  private printResults() {
    logger.info("\n" + "=".repeat(60));
    logger.info("API TEST RESULTS SUMMARY");
    logger.info("=".repeat(60));

    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;
    const total = this.results.length;

    logger.info(`Total Tests: ${total}`);
    logger.info(`Passed: ${passed}`);
    logger.info(`Failed: ${failed}`);
    logger.info(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    logger.info("\nDetailed Results:");
    logger.info("-".repeat(60));

    this.results.forEach((result) => {
      const statusIcon = result.status === "PASS" ? "✅" : "❌";
      logger.info(`${statusIcon} ${result.test}: ${result.message}`);
    });

    logger.info("=".repeat(60));

    if (failed === 0) {
      logger.info("🎉 All tests passed! Your API is working correctly.");
    } else {
      logger.info(
        `⚠️  ${failed} test(s) failed. Please review the results above.`
      );
    }
  }
}

async function testAPIs() {
  const tester = new APITester();
  await tester.runTests();
}

// Run the API tests
testAPIs();
