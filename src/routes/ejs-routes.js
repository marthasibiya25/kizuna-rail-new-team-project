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
// login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' }); 
});

router.get('/403', (req, res) => {
  res.status(403).render('errors/403', { 
    title: '403 - Access Denied',
    user: req.user || req.session?.user 
  });
});
export default router;