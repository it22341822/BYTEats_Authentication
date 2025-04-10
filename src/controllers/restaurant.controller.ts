import { Request, Response } from 'express';
import Restaurant from '../models/restaurant.model';
import { IRestaurant } from '../interfaces/IRestaurant';

export const getRestaurantById = async  (req: Request, res: Response) => {
    try{
        const {id} = req.params;

        const restaurant : IRestaurant | null = await  Restaurant.findById(id);

        if(!restaurant){
            return res.status(404).json({message: 'Restaurant not found'});
        }

        res.status(200).json(restaurant);
    }
    catch(error){
        console.error('Error fetching restaurant:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const getAllRestaurants = async (req: Request, res: Response) => {
    try{
        const restaurants : IRestaurant[] | null = await Restaurant.find();

        if(restaurants === null || restaurants.length === 0){
            return res.status(404).json({message: 'No restaurants found'});
        }

        res.status(200).json(restaurants);
    }
    catch(error){
        console.error('Error fetching restaurants:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const updateRestaurant = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const {name, location, owner_name, mobile} = req.body;

        const restaurant : IRestaurant | null  = await Restaurant.findById(id);

        if(!restaurant){
            return res.status(404).json({message: 'Restaurant not found'});
        }

        const updatedRestaurant : IRestaurant | null = await Restaurant.findByIdAndUpdate(id, {name, location, owner_name, mobile}, {new: true});

        res.status(200).json(updatedRestaurant);

    }
    catch(error){
        console.error('Error updating restaurant:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const deleteRestaurant = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;

        const restaurant : IRestaurant | null  = await Restaurant.findById(id);

        if(!restaurant){
            return res.status(404).json({message: 'Restaurant not found'});
        }

        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

        res.status(200).json({message : "successfully deleted",

            deletedRestaurant
        });
    }
    catch(error){
        console.error('Error deleting restaurant:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}