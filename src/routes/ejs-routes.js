import { Router } from "express";
import {
  bookingPage,
  processBookingRequest,
  bookingConfirmationPage,
  bookingsAdminPage,
} from "../controllers/bookings.js";
import { renderTripListPage } from "../controllers/routes/index.js";
import { renderTripDetailsPage } from "../controllers/routes/details.js";
import { userAdminPage } from "../controllers/users.js";
import { requirePageLogin, requirePageRole } from "../middleware/auth.js";

const router = Router();

// Trips EJS pages
router.get("/routes", renderTripListPage);
router.get("/routes/:routeId", renderTripDetailsPage);

// Booking pages
router.get("/routes/booking/:scheduleId", bookingPage);
router.post("/routes/book", processBookingRequest);
router.get("/routes/bookings/:bookingId", bookingConfirmationPage);

// Bookings admin page
router.get(
  "/bookings-admin",
  requirePageRole("admin"),
  bookingsAdminPage,
);

// User dashboard page
router.get("/user/dashboard", requirePageLogin, (req, res) => {
  res.render("user/dashboard", {
    title: "User Dashboard",
  });
});

// User admin page
router.get("/user-admin", requirePageLogin, userAdminPage);

export default router;