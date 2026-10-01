import { Router } from 'express';
import { requirePageRole } from '../../middleware/auth.js';

const router = Router();

router.get('/trips', requirePageRole('admin'), (req, res) => {
  res.render('admin/trips', {
    title: 'Trip Administration',
    user: req.user
  });
});

export default router;