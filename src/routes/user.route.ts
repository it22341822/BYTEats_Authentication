import express from 'express';
import { getUser, deleteUser } from '../controllers/user.controller';

const router = express.Router();

router.get('/:id', getUser as express.RequestHandler);
router.delete('/:id', deleteUser as express.RequestHandler);

export default router;