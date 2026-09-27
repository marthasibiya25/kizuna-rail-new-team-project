import { Router } from "express";

const router = Router();

// TEMPORARY dev-only login/logout, for testing before #13 lands.
// Delete this whole file once real /login and /logout exist.

router.get("/dev-login/:role", (req, res) => {
  const role = req.params.role === "admin" ? "admin" : "user";
  const email = req.query.email || (role === "admin" ? "admin@example.com" : "user@example.com");
  const displayName = req.query.name || (role === "admin" ? "Test Admin" : "Test User");

  req.session.user = { displayName, email, role };

  res.send(
    `Logged in as <strong>${role}</strong> (${email}). ` +
    `<a href="/bookings-admin">Go to Bookings Admin</a> | ` +
    `<a href="/dev-logout">Log out</a>`
  );
});

router.get("/dev-logout", (req, res) => {
  req.session.destroy(() => res.send('Logged out. <a href="/">Home</a>'));
});

export default router;