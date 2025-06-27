import jwt from "jsonwebtoken";
import { AuthService } from "../../src/services/authService";
import { IUser } from "../../src/models/User";
import config from "../../src/config";

describe("AuthService", () => {
  const mockUser: Partial<IUser> = {
    _id: "507f1f77bcf86cd799439011",
    email: "test@example.com",
    role: "user",
  };

  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      const token = AuthService.generateToken(mockUser as IUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const decoded = jwt.verify(token, config.jwtSecret) as any;
      expect(decoded.userId).toBe(mockUser._id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid token", () => {
      const token = AuthService.generateToken(mockUser as IUser);
      const decoded = AuthService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(mockUser._id);
      expect(decoded?.email).toBe(mockUser.email);
      expect(decoded?.role).toBe(mockUser.role);
    });

    it("should return null for invalid token", () => {
      const decoded = AuthService.verifyToken("invalid-token");
      expect(decoded).toBeNull();
    });
  });

  describe("extractTokenFromHeader", () => {
    it("should extract token from valid Authorization header", () => {
      const token = "valid-token";
      const header = `Bearer ${token}`;

      const extracted = AuthService.extractTokenFromHeader(header);
      expect(extracted).toBe(token);
    });

    it("should return null for invalid Authorization header", () => {
      const header = "InvalidHeader valid-token";
      const extracted = AuthService.extractTokenFromHeader(header);
      expect(extracted).toBeNull();
    });

    it("should return null for missing Authorization header", () => {
      const extracted = AuthService.extractTokenFromHeader("");
      expect(extracted).toBeNull();
    });
  });
});
