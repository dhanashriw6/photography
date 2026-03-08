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
import RequestBook from './views/findPhotographer/requestBook';
import ThankYou from './views/findPhotographer/thankYou';
import BookingSummary from './views/findPhotographer/bookingSummary';
import FindHomePage from './views/findPhotographer/home';
import EditProfile from './views/findPhotographer/editProfile';
import Review from './views/findPhotographer/review';
import Dispute from './views/findPhotographer/dispute';


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
        <Route path="/photographer/:id" element={<PhotographerDetail />} />
        <Route path="/requestBook" element={<RequestBook />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/booking-summary" element={<BookingSummary />} />
        <Route path="/home" element={<FindHomePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/review" element={<Review />} />
        <Route path="/dispute" element={<Dispute />} />
      </Routes>
    </>
  );
}

export default App;
