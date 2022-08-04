import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Explore = lazy(() => import('./pages/Explore/Explore'));
const ForgotPassword = lazy(() =>
  import('./pages/ForgotPassword/ForgotPassword')
);
const Offers = lazy(() => import('./pages/Offers/Offers'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const SignIn = lazy(() => import('./pages/SignIn/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const Navbar = lazy(() => import('./components/Navbar/Navbar'));
const Category = lazy(() => import('./pages/Category/Category'));
const CreateListing = lazy(() => import('./pages/CreateListing/CreateListing'));
const ListingPage = lazy(() => import('./pages/ListingPage/ListingPage'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const EditListing = lazy(() => import('./pages/EditListing/EditListing'));
const ProtectedRoute = lazy(() =>
  import('./components/ProtectedRoute/ProtectedRoute')
);
const PageNotFound = lazy(() => import('./pages/PageNotFound/PageNotFound'));

import Spinner from './components/UI/Spinner/Spinner';

import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
      <Suspense fallback={<Spinner />}>
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
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <Navbar />
      <ToastContainer pauseOnHover={false} />
    </>
  );
};

export default App;
