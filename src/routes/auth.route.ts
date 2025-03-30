import express from 'express';
import { login, register } from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', login as express.RequestHandler);
router.post('/register', register as express.RequestHandler);

export default router;