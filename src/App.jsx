import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import ScrollSwirl from './Components/Carousel';
import Home from './views/Home';
import SignUp from './views/findPhotographer/signUp';
import Login from './views/findPhotographer/login';
import StylePrefer from './views/findPhotographer/stylePrefer';
import TellUs from './views/findPhotographer/tellUs';
import PackageSuggestion from './views/findPhotographer/packageSuggestion';
import FindBest from './views/findPhotographer/findBest';
import PhotographerDetail from './views/findPhotographer/photographerDetail';
import RequestBook from './views/findPhotographer/requestBook';
import ThankYou from './views/findPhotographer/thankYou';
import BookingSummary from './views/findPhotographer/bookingSummary';
import FindHomePage from './views/findPhotographer/home';
import EditProfile from './views/findPhotographer/editProfile';
import Review from './views/findPhotographer/review';
import Dispute from './views/findPhotographer/dispute';
import SignUpPhotographer from './views/joinAsPhotographer/signUp';
import LoginPhotographer from './views/joinAsPhotographer/login';
import OTPVerification from './views/joinAsPhotographer/otpVerification';
import KYCVerification from './views/joinAsPhotographer/kycVerification';
import VerificationIP from './views/joinAsPhotographer/verificationIP';
import Dashboard from './views/joinAsPhotographer/dashboard';
import PhotographerEditProfile from './views/joinAsPhotographer/photographerEditProfile';
import OrderSummary from './views/joinAsPhotographer/orderSummary';
import JoinHomePage from './views/joinAsPhotographer/joinHomePage';
import ProtectedRoute from './Components/ProtectedRoute';
import PublicRoute from './Components/PublicRoute';
import ResetPassword from './views/joinAsPhotographer/resetPassword';
import SelectPackage from './views/findPhotographer/selectPackage';
import DraftOrders from './views/findPhotographer/draftOrders';
import LegalPage from './views/LegalPage';
import CustomerEditProfile from './views/findPhotographer/customerEditProfile';
import AvailabilityCalendarPage from './views/joinAsPhotographer/AvailabilityCalendar';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-photographer" element={<SignUp />} />
        <Route path="/v1" element={<ScrollSwirl />} />
        <Route path="/login" element={<Login />} />
        <Route path="/style-prefer" element={<StylePrefer />} />
        <Route path="/tell-us" element={<TellUs />} />
        <Route path="/package-suggestion" element={<PackageSuggestion />} />
        <Route path="/find-best" element={<FindBest />} />
        <Route path="/select-package" element={<SelectPackage />} />
        <Route path="/photographer/:id" element={<PhotographerDetail />} />
        <Route path="/requestBook" element={<RequestBook />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/draft-orders" element={<DraftOrders />} />
        <Route path="/booking-summary" element={<BookingSummary />} />
        <Route path="/home" element={<FindHomePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/review" element={<Review />} />
        <Route path="/dispute" element={<Dispute />} />
        <Route path="/legal" element={<LegalPage />}/>
        <Route path="/customer/edit-profile" element={<CustomerEditProfile />} />
        {/* Public auth pages — already logged-in users go straight to dashboard */}
        <Route element={<PublicRoute />}>
          <Route path="/join-as-photographer" element={<SignUpPhotographer />} />
          <Route path="/join-as-photographer/login" element={<LoginPhotographer />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected pages — no token sends user back to signup */}
        <Route element={<ProtectedRoute />}>
          
          <Route path="/join-as-photographer/kyc-verification" element={<KYCVerification />} />
          <Route path="/join-as-photographer/verification-ip" element={<VerificationIP />} />
          <Route path="/join-as-photographer/dashboard" element={<Dashboard />} />
          <Route path="/join-as-photographer/edit-profile" element={<PhotographerEditProfile />} />
          <Route path="/join-as-photographer/home" element={<JoinHomePage />} />
        </Route>

        <Route path="/order-summary" element={<OrderSummary />} />
      </Routes>
    </>
  );
}

export default App;
