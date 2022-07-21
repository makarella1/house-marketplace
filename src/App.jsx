import { Routes, Route } from 'react-router-dom';

import Explore from './pages/Explore';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Navbar from './components/Navbar/Navbar';

import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      <Navbar />
      <ToastContainer pauseOnHover={false} />
    </>
  );
};

export default App;
