const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    // Replace 'yourdbname' and 'yourMongoDBURL' with your actual database name and connection string
    const dbURI = 'mongodb+srv://ArnavAnand:1234@cluster0.fa2ft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Example: 'mongodb://username:password@localhost:27017/yourdbname'

    await mongoose.connect(dbURI, );

    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

// Export the connection function
module.exports = dbConnection;
