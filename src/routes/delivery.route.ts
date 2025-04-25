import express, { RequestHandler } from 'express';
import { 
  registerDelivery,
  loginDelivery,
  updateDelivery,
  deleteDelivery
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Delivery person routes
router.post('/register', registerDelivery as RequestHandler);
router.post('/login', loginDelivery as RequestHandler);
router.put('/update/:id', authenticate as RequestHandler, updateDelivery as RequestHandler);
router.delete('/delete/:id', authenticate as RequestHandler, deleteDelivery as RequestHandler);

// profile-related endpoints for delivery persons
// router.get('/profile', authenticate as RequestHandler, getDeliveryProfile as RequestHandler);
// router.put('/profile', authenticate as RequestHandler, updateDeliveryProfile as RequestHandler);
// router.delete('/profile', authenticate as RequestHandler, deleteDeliveryAccount as RequestHandler);

export default router;