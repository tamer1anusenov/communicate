import 'reflect-metadata';
import { config } from 'dotenv';
import { AppDataSource } from './config/database';
import app from './app';

// Load environment variables
config();

const PORT = process.env.PORT || 5000; // Changed from 5000 to 5001

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
  });