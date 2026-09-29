import { Router } from 'express';
import { requirePageRole } from '../../middleware/auth.js';
import Trip from '../../models/schemas/trips.js'; 

const router = Router();

router.get('/trips', requirePageRole('admin'), async (req, res, next) => {
  try {
    const trips = await Trip.find().lean();
    res.render('admin/trips', {
      title: 'Trip Administration',
      trips,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
});

export default router;

