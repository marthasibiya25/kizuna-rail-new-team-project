import { Router } from 'express';
import challengeScenariosRouter from './scenarios.js';
import apiRoutes from './api-routes.js';
import adminTripsRouter from './admin/trips.js';
import ejsRoutes from './ejs-routes.js';
import { homePage, aboutPage, testErrorPage } from './index.js';
const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

router.use('/admin', adminTripsRouter);
router.use('/api', apiRoutes);
router.use('/scenarios', challengeScenariosRouter);

// EJS pages
router.use('/', ejsRoutes);


// JSON API
router.use('/api', apiRoutes);

// Challenge scenarios
router.use('/scenarios', challengeScenariosRouter);

// Test 500 error page
router.get('/500', testErrorPage);


export default router;