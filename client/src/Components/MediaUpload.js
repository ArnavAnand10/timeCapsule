import { Button, CircularProgress, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import HttpsIcon from '@mui/icons-material/Https';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';

const MediaUpload = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [dateValue, setDateValue] = useState(dayjs()); // State for date and time
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]); // State to store fetched media files
  const fileInputRef = useRef();

  useEffect(() => {
    // Check for email in local storage
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/signin'); // Redirect to sign-in if no email
    } else {
      fetchMedia(email); // Fetch media files for the logged-in user
    }
  }, [navigate]);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Triggers file input click
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected file name:", selectedFile.name); // Log the selected file name

    if (selectedFile) {
      setFileName(selectedFile.name); // Set the file name
      try {
        setUploading(true); // Set uploading state
        const url = "https://api.cloudinary.com/v1_1/dfy1aggwn/upload"; // Your Cloudinary cloud name
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("upload_preset", "pksu6lzd"); // Your upload preset

        // Upload to Cloudinary
        const response = await axios.post(url, formData);
        setUploadedUrl(response.data.secure_url); // Store the uploaded file URL

        // Post data to the backend with file name directly
        console.log('Uploaded');
        await postFileData(selectedFile.name, response.data.secure_url); // Call function to post data with file name

      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false); // Reset uploading state
      }
    }
  };

  const postFileData = async (fileName, cloudinaryUrl) => {
    try {
      const email = localStorage.getItem('email'); // Retrieve email from local storage
      const response = await axios.post('http://localhost:3000/api/upload', {
        fileName: fileName, // Use the fileName passed as an argument
        fileUrl: cloudinaryUrl,
        dateTime: dateValue.format(), // Format the date and time for your backend
        email: email // Include the email in the request body
      });

      console.log("Data posted successfully:", response.data);
      // After posting, refetch media to include the newly uploaded file
      fetchMedia(email); // Fetch media after upload
    } catch (error) {
      console.error("Error posting data to backend:", error);
    }
  };

  const fetchMedia = async (email) => {
    try {
      const response = await axios.get('http://localhost:3000/api/getMedia', {
        params: { email } // Send the email as a query parameter
      });
      setMediaFiles(response.data.media); // Store the fetched media files
      console.log("Fetched media files:", response.data.media);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('MMMM D, YYYY h:mm A'); // Format date
  };

  return (
    <div style={{
      background: 'rgb(238,174,202)',
      background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
      width: '100%',
      height: '100vh'
    }}
      className="flex flex-row p-5 gap-5 ">
      <div className='basis-1/5 flex flex-col bg-white rounded-md '>
        <div className='flex flex-col items-center gap-5 p-4 '>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }} // Hides the file input
            onChange={handleFileChange}
          />

          <Button sx={{
            borderColor: "white",
            color: "black",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            "&:hover": {
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            },
          }} fullWidth variant="outlined" startIcon={<LockOpenIcon />}>
            Unlocked Files
          </Button>

          <Button sx={{
            borderColor: "white",
            color: "black",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            "&:hover": {
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            },
          }} fullWidth variant="outlined" startIcon={<HttpsIcon />}>
            Locked Files
          </Button>

          <Button sx={{
            borderColor: "white",
            color: "black",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            "&:hover": {
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
            },
          }} fullWidth variant="outlined" startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </div>
      </div>

      <div className='basis-full flex flex-col gap-5 p-4 bg-white rounded-md'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Select Date and Time"
            value={dateValue}
            onChange={(newValue) => setDateValue(newValue)} // Update date and time state
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <Button onClick={handleButtonClick} sx={{
          borderColor: "white",
          color: "black",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
          "&:hover": {
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          },
        }} fullWidth variant="outlined" startIcon={!uploading ? <AddIcon /> : ''}>
          {uploading ? <CircularProgress sx={{
            width: '24',
            height: '24',
          }} /> : 'Upload'}
        </Button>
        
        {/* Display fetched media files */}
        <div className='flex flex-row gap-5'>
          {mediaFiles.length > 0 ? (
            <ul>
              {mediaFiles.map((file) => {
                const isAccessible = dayjs().isAfter(dayjs(file.scheduledDateTime)); // Check if current time is after the scheduled time
                return (
                  <div className='flex flex-row gap-5 p-2' key={file._id}>
                    <li>
                      {isAccessible ? (
                        <Button variant="contained" color="primary" onClick={() => window.open(file.fileUrl, '_blank')}>
                          Access File: {file.fileName}
                        </Button>
                      ) : (
                        <span>File is locked until {formatDateTime(file.scheduledDateTime)}</span>
                      )}
                      <p>Uploaded on: {formatDateTime(file.uploadDate)}</p>
                    </li>
                  </div>
                );
              })}
            </ul>
          ) : (
            <p>No media files uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaUpload;
