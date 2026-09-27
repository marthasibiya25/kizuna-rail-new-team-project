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
import { requirePageLogin } from "../middleware/auth.js";

const router = Router();

router.get("/routes", renderTripListPage);
router.get("/routes/:routeId", renderTripDetailsPage);

router.get("/routes/booking/:scheduleId", bookingPage);
router.post("/routes/book", processBookingRequest);
router.get("/routes/bookings/:bookingId", bookingConfirmationPage);

// Bookings admin page (protected — requires login)
router.get("/bookings-admin", requirePageLogin(), bookingsAdminPage);

export default router;