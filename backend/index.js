const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const connectToCloudinary=require('./config/cloudinary');

//Import routes
const adminRouter = require('./routes/admin.route');
const doctorRouter = require('./routes/doctor.route');
const userRouter=require('./routes/user.route');

dotenv.config();

//app configuration
const app = express();
const port = process.env.PORT || 4000;
connectDB();    
connectToCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

