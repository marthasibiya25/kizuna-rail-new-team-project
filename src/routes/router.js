import { Router } from 'express';
import challengeScenariosRouter from './scenarios.js';
import apiRoutes from './api-routes.js';
import ejsRoutes from './ejs-routes.js';
import devAuthRoutes from './dev-auth.js';
import { homePage, aboutPage, testErrorPage } from './index.js';

const router = Router();

router.get('/', homePage);
router.get('/about', aboutPage);
router.use('/', ejsRoutes);

// TEMPORARY — remove once Feature Set 1 (#13) provides real /login, /logout
router.use('/', devAuthRoutes);

router.use('/api', apiRoutes);
router.use('/scenarios', challengeScenariosRouter);
router.get('/500', testErrorPage);

export default router;