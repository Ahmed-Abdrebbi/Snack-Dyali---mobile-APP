import app from './src/app.js';
import sequelize from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Sync database and start server
const startServer = async () => {
  try {
    // Authenticate and sync models with database
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    // Sync models (in production you might use migrations instead)
    await sequelize.sync(); 
    console.log('All models were synchronized successfully.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();