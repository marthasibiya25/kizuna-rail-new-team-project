import { getAllUsers } from "../models/users.js";

export async function usersAdminPage(req, res, next) {
  try {
    const users = await getAllUsers();

    return res.render("users-admin", {
      title: "Users Admin",
      users,
    });
  } catch (error) {
    console.error("Error loading users admin page:", error);
    return next(error);
  }
}