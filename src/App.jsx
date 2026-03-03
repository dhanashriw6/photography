import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import ScrollSwirl from './Components/Carousel';
import CustomCursor from './Components/CustomCursor';
import Home from './views/Home';
import SignUp from './views/findPhotographer/signUp';
import Login from './views/findPhotographer/login';
import StylePrefer from './views/findPhotographer/stylePrefer';
import TellUs from './views/findPhotographer/tellUs';
import FindBest from './views/findPhotographer/findBest';
import PhotographerDetail from './views/findPhotographer/photographerDetail';

function App() {
  return (
    <>
      {/* Global custom cursor for all routes */}
      <CustomCursor />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-photographer" element={<SignUp />} />
        <Route path="/v1" element={<ScrollSwirl />} />
        <Route path="/login" element={<Login />} />
        <Route path="/style-prefer" element={<StylePrefer />} />
        <Route path="/tell-us" element={<TellUs />} />
        <Route path="/find-best" element={<FindBest />} />
        {/* <Route path="/photographer/:id" element={<PhotographerDetail />} /> */}
      </Routes>
    </>
  );
}

export default App;
