import express from 'express';
import connectDB from './config/dbConnect';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from "cookie-parser";
import deliveryRoutes from './routes/delivery.route';
import authRoute from "./routes/auth.route";
<<<<<<< HEAD
=======
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";

>>>>>>> d1eb5f750e044379f06fa7140f9746fb380f883f
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("BYTEATS backend on notch");
  });

app.use("/api/auth", authRoute);
<<<<<<< HEAD
app.use("/api/delivery", deliveryRoutes);
=======
app.use("/api/user", userRoute);
app.use("/api/restaurant", restaurantRoute);
>>>>>>> d1eb5f750e044379f06fa7140f9746fb380f883f

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
  
export default app;