import { IUser } from "../models/User";
import User from "../models/User";
import logger from "../config/logger";

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: "user" | "admin";
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  isActive?: boolean;
}

export class UserService {
  static async createUser(userData: CreateUserData): Promise<IUser> {
    try {
      const user = new User(userData);
      await user.save();
      logger.info(`User created: ${user.email}`);
      return user;
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  static async findUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      logger.error("Error finding user by ID:", error);
      throw error;
    }
  }

  static async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      logger.error("Error finding user by email:", error);
      throw error;
    }
  }

  static async updateUser(
    userId: string,
    updateData: UpdateUserData
  ): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (user) {
        logger.info(`User updated: ${user.email}`);
      }

      return user;
    } catch (error) {
      logger.error("Error updating user:", error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(userId);
      if (result) {
        logger.info(`User deleted: ${result.email}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error("Error deleting user:", error);
      throw error;
    }
  }

  static async getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: IUser[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        User.countDocuments(),
      ]);

      return { users, total };
    } catch (error) {
      logger.error("Error getting all users:", error);
      throw error;
    }
  }

  static async validateUserCredentials(
    email: string,
    password: string
  ): Promise<IUser | null> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user || !user.isActive) {
        return null;
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return null;
      }

      return user;
    } catch (error) {
      logger.error("Error validating user credentials:", error);
      throw error;
    }
  }
}
