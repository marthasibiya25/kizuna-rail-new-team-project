import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/schemas/users.js";
import Role from "../src/models/schemas/roles.js";

const email = process.argv[2];

if (!email) {
  console.error(
    "Usage: pnpm exec node scripts/make-admin.js email@example.com",
  );
  process.exitCode = 1;
}

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminRole = await Role.findOne({ name: "admin" });

    if (!adminRole) {
      throw new Error(
        "Admin role is not initialized. Run pnpm run seed:roles first.",
      );
    }

    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { role: adminRole._id },
      { new: true },
    );

    if (!user) {
      throw new Error(`No user found with email: ${email}`);
    }

    console.log(`User ${user.email} is now an admin.`);
  } catch (error) {
    console.error("Failed to make user admin:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

if (email) {
  makeAdmin();
}
