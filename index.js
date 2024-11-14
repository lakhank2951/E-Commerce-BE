import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/config.js';
import swaggerDocs from './config/swagger.js';
import routes from './routes/app.route.js';  // Importing routes

const app = express();

// Middleware setup
app.use(express.json());  // To parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));  // To parse incoming URL-encoded requests
app.use(cors());  // To allow cross-origin resource sharing
app.use('/uploads', express.static('uploads'));  // Serve static files from the 'uploads' folder

// Initialize routes
routes(app);  // Using the imported routes

// MongoDB connection setup
mongoose.Promise = global.Promise;

mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,  // Use the new parser for URL connection strings
    useUnifiedTopology: true,  // Ensures the connection uses the latest drivers
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Start the server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);

    // Initialize Swagger documentation
    swaggerDocs(app, config.port);
});
