import express from 'express';
import { login, register, forgotPassword, verifyOTP, resetPassword } from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', login as express.RequestHandler);
router.post('/register', register as express.RequestHandler);
router.post('/forgot-password', forgotPassword as express.RequestHandler);
router.post('/verify-otp', verifyOTP as express.RequestHandler);
router.post('/reset-password', resetPassword as express.RequestHandler);

export default router;