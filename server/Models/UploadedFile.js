const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    scheduledDateTime: {
      type: String,
      required: true,
    },
  });

// Create a model based on the schema
const UploadedFile = mongoose.model('UploadedFile', uploadSchema);

// Export the model
module.exports = UploadedFile;
