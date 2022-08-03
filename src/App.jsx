import { Routes, Route } from 'react-router-dom';

import Explore from './pages/Explore/Explore';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Offers from './pages/Offers/Offers';
import Profile from './pages/Profile/Profile';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Navbar from './components/Navbar/Navbar';
import Category from './pages/Category/Category';
import CreateListing from './pages/CreateListing/CreateListing';
import ListingPage from './pages/ListingPage/ListingPage';
import Contact from './pages/Contact/Contact';
import EditListing from './pages/EditListing/EditListing';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/profile" element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/categories/:categoryName" element={<Category />} />
        <Route
          path="/categories/:categoryName/:listingId"
          element={<ListingPage />}
        />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/create-listing" element={<ProtectedRoute />}>
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
        <Route path="/contact/:landlordId" element={<Contact />} />
        <Route path="/edit-listing/:listingId" element={<EditListing />} />
      </Routes>
      <Navbar />
      <ToastContainer pauseOnHover={false} />
    </>
  );
};

export default App;
