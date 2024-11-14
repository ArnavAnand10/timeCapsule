import './App.css';
import MediaUpload from './Components/MediaUpload';

import SignIn from './Components/SignIn';
import { Route, RouterProvider, Routes } from 'react-router-dom';

function App() {
  return (
  
   <Routes>
      <Route path="/" element={<SignIn />} />,

   <Route path="/signin" element={<SignIn />} />,
   <Route path="/media" element={<MediaUpload  />} />,

   </Routes>

  )
}

export default App;
