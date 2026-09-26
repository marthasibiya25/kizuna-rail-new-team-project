import { Router } from "express";
import {
  bookingPage,
  processBookingRequest,
  bookingConfirmationPage,
  bookingsAdminPage,
} from "../controllers/bookings.js";
import {
  renderTripListPage,
  renderTripDetailsPage,
} from "../controllers/trips.js";
import { userAdminPage } from "../controllers/users.js";
import { requirePageLogin } from "../middleware/auth.js";

const router = Router();

// Trips EJS pages
router.get("/routes", renderTripListPage);
router.get("/routes/:routeId", renderTripDetailsPage);

// Booking pages
router.get("/routes/booking/:scheduleId", bookingPage);
router.post("/routes/book", processBookingRequest);
router.get("/routes/bookings/:bookingId", bookingConfirmationPage);

// Bookings admin page
router.get("/bookings-admin", bookingsAdminPage);

// User admin page
router.get("/user-admin", requirePageLogin, userAdminPage);

export default router;
