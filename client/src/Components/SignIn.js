import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/signin', { email, password });
      setSuccess(response.data.message);
      console.log(response.data)
      localStorage.setItem('email',response.data.email)
      navigate('/media');
    } catch (err) {
      setError(err.response.data.message || 'Signin failed');
    }
  };

  return (
    <Container component={Paper} elevation={3} sx={{ padding: 4, maxWidth: 400, marginTop: 5 }}>
      <Typography variant="h4" align="center">Sign In</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign In
        </Button>
      </form>
      {error && <Typography color="error" align="center">{error}</Typography>}
      {success && <Typography color="primary" align="center">{success}</Typography>}
    </Container>
  );
};

export default SignIn;
