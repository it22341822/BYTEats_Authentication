import express from 'express';
import { login, register } from '../controllers/restaurant.auth.controller';
import {getRestaurantById, getAllRestaurants, updateRestaurant, deleteRestaurant} from '../controllers/restaurant.controller';

const router = express.Router();

router.post('/login', login as express.RequestHandler);
router.post('/register', register as express.RequestHandler);
router.get('/', getAllRestaurants as express.RequestHandler);
router.get('/:id', getRestaurantById as express.RequestHandler);
router.put('/:id', updateRestaurant as express.RequestHandler);
router.delete('/:id', deleteRestaurant as express.RequestHandler);

export default router;