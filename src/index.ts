import express from 'express';
import connectDB from './config/dbConnect';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from "cookie-parser";
import deliveryRoutes from './routes/delivery.route';
import authRoute from "./routes/auth.route";
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
app.use("/api/delivery", deliveryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
  
export default app;