const express = require('express');
const UploadedFile = require('../Models/UploadedFile');
const User = require('../Models/UserModel');
const { scheduleEmail } = require('../EmailScheduler/mailer');

const router = express.Router();


router.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'email already exists' });
      }
  
      const newUser = new User({ email, password });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check if the password matches
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Successful sign in
      res.status(200).json({ message: 'Sign in successful',email: email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.post('/api/upload', async (req, res) => {
    const { fileName, fileUrl, dateTime,email } = req.body;
    console.log(req.body);
     // Destructure the data from the request body
  
    // Check if all required fields are provided
    if (!fileName || !fileUrl || !dateTime || !email) {
      return res.status(400).json({ message: 'Please provide fileName, fileUrl, and dateTime.' });
    }
  
    try {
      // Create a new instance of the UploadedFile model
      const newFile = new UploadedFile({
        email,
        fileName,
        fileUrl,
        scheduledDateTime: dateTime,
        
      });
  
      // Save the new file entry to the database
      console.log(dateTime)
      await newFile.save();
      scheduleEmail(email,dateTime)
  
      // Respond with a success message and the saved file data
      res.status(201).json({ message: 'File data saved successfully!', file: newFile });
    } catch (error) {
      console.error('Error saving file data:', error);
      res.status(500).json({ message: 'Error saving file data', error: error.message });
    }
  });


  router.get('/api/getMedia', async (req, res) => {
    const email = req.query.email; // Use req.query to get the email
    try {
      const data = await UploadedFile.find({ email }); // Query your database for files uploaded by this email
      res.status(200).json({ media: data });
    } catch (e) {
      console.log(`Error occurred: ${e}`);
      res.status(501).json({ message: "Internal Server Error" });
    }
  });
  
module.exports = router;