import { Button, CircularProgress, TextField, Card, CardContent, CardActions, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HttpsIcon from '@mui/icons-material/Https';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';

const MediaUpload = () => {
  const navigate = useNavigate(); 
  const [dateValue, setDateValue] = useState(dayjs());
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/signin');
    } else {
      fetchMedia(email);
    }
  }, [navigate]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleLogout = ()=>{
    localStorage.removeItem("email");
    navigate("/signin")
  }

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      try {
        setUploading(true);
        const url = "https://api.cloudinary.com/v1_1/dfy1aggwn/upload";
        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("upload_preset", "pksu6lzd");

        const response = await axios.post(url, formData);
        setUploadedUrl(response.data.secure_url);

        await postFileData(selectedFile.name, response.data.secure_url);

      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const postFileData = async (fileName, cloudinaryUrl) => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.post('http://localhost:3000/api/upload', {
        fileName,
        fileUrl: cloudinaryUrl,
        dateTime: dateValue.format(),
        email
      });

      fetchMedia(email);
    } catch (error) {
      console.error("Error posting data to backend:", error);
    }
  };

  const fetchMedia = async (email) => {
    try {
      const response = await axios.get('http://localhost:3000/api/getMedia', {
        params: { email }
      });
      setMediaFiles(response.data.media);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('MMMM D, YYYY h:mm A');
  };

  return (
    <div style={{
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
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

        

          <Button onClick={handleLogout} fullWidth variant="outlined" startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </div>
      </div>

      <div className='basis-full flex flex-col gap-5 p-4 bg-white rounded-md'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Select Date and Time"
            value={dateValue}
            onChange={(newValue) => setDateValue(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <Button onClick={handleButtonClick} fullWidth variant="outlined" startIcon={!uploading ? <AddIcon /> : ''}>
          {uploading ? <CircularProgress sx={{ width: '24', height: '24' }} /> : 'Upload'}
        </Button>
        
        {/* Display fetched media files as cards */}
        <div className='flex flex-wrap gap-5 mt-4'>
          {mediaFiles.length > 0 ? (
            mediaFiles.map((file) => {
              const isAccessible = dayjs().isAfter(dayjs(file.scheduledDateTime));
              return (
                <Card key={file._id} sx={{ width: 250, height: 150, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  {isAccessible ? (
                    <>
                      <CardContent>
                        <Typography variant="h">{file.fileName.substring(0,7)+"..."}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Uploaded on: {formatDateTime(file.uploadDate)}
                        </Typography>
                      </CardContent>
                        <Button fullWidth variant="contained" color="primary" onClick={() => window.open(file.fileUrl, '_blank')}>
                          View
                        </Button>
                    </>
                  ) : (
                    
                    <div className='flex flex-col gap-2 items-center'>
                      <HttpsIcon sx={{width:100,height:50}}/>
                    
                    <div className='flex flex-col justify-start'></div>
                      
                  <p className='text-xs'> Locked Until: {formatDateTime(file.scheduledDateTime)} </p>
                      </div>
                  )}
                </Card>
              );
            })
          ) : (
            <Typography>No media files uploaded yet.</Typography>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaUpload;
