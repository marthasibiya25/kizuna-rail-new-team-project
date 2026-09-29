import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import Trip from '../../models/schemas/trips.js'; 

const router = Router();

router.get('/trips', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    
    const trips = await Trip.find().lean();

    res.render('admin/trips', {
      title: 'Trip Administration',
      trips,
      user: req.session ? req.session.user : null
    });
  } catch (error) {
    next(error);
  }
});

export default router;