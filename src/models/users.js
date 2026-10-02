import bcrypt from "bcrypt";
import Role from "./schemas/roles.js";
import User from "./schemas/users.js";

export async function createUser(displayName, username, email, password) {
  const customerRole = await Role.findOne({ name: "customer" });

  if (!customerRole) {
    throw new Error("Customer role is not initialized.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return User.create({
    displayName,
    username,
    email: email.trim().toLowerCase(),
    passwordHash,
    role: customerRole._id,
  });
}

export async function findUserByEmail(email) {
  return User.findOne({ email: email.trim().toLowerCase() }).populate("role");
}

export async function findUserById(userId) {
  return User.findById(userId).populate("role");
}

export async function updateUserProfile(userId, profileData) {
  return User.findByIdAndUpdate(
    userId,
    {
      displayName: profileData.displayName.trim(),
      email: profileData.email.trim().toLowerCase(),
      bio: profileData.bio?.trim() || "",
      avatarUrl: profileData.avatarUrl?.trim() || "",
    },
    { new: true, runValidators: true },
  ).populate("role");
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId);

  if (!user) {
    return { success: false, reason: "not-found" };
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!passwordMatches) {
    return { success: false, reason: "invalid-password" };
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  return { success: true };
}

export async function deactivateUser(userId) {
  return User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true },
  );
}

export async function recordUserLogin(userId) {
  return User.findByIdAndUpdate(
    userId,
    { lastLogin: new Date() },
    { new: true },
  );
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
