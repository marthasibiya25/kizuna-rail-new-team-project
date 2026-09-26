import mongoose from "mongoose";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../models/users.js";

export function userAdminPage(req, res) {
  res.render("user-admin", {
    title: "User Admin",
  });
}

export async function getUsers(req, res) {
  try {
    if (req.user.role === "admin") {
      const users = await getAllUsers();
      return res.status(200).json(users);
    }

    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json([user]);
  } catch (error) {
    console.error("Error fetching users:", error);

    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
}

export async function updateUserById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    if (req.user.role !== "admin" && req.body.role) {
      return res.status(403).json({
        error: "You cannot change your role",
      });
    }

    const user = await updateUser(id, req.body);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (req.user.id === id) {
      req.session.user = {
        ...req.session.user,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        role: user.role.name,
      };
      req.user = req.session.user;
      res.locals.user = req.user;
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: "Username or email is already in use.",
      });
    }

    return res.status(400).json({
      error: "Failed to update user",
    });
  }
}

export async function deleteUserById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    const user = await deleteUser(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (req.user.id === id) {
      req.session.destroy((error) => {
        if (error) {
          console.error("Error destroying session:", error);
        }
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    return res.status(500).json({
      error: "Failed to delete user",
    });
  }
}
