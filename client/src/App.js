import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateListing from './pages/CreateListing';
import { ListingDetails } from './pages/ListingDetails';
import TripList from './pages/TripList';
import WishList from './pages/WishList';
import PropertyList from './pages/PropertyList';
import ReservationList from './pages/ReservationList';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/AdminDashboard'; // Import the admin dashboard page

function App() {
  const userRole = localStorage.getItem("userRole");
  console.log(userRole)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          <Route path="/:userId/trips" element={<TripList />} />
          <Route path="/:userId/wishlist" element={<WishList />} />
          <Route path="/:userId/properties" element={<PropertyList />} />
          <Route path="/:userId/reservations" element={<ReservationList />} />
          {userRole === "admin" && <Route path="/admin/dashboard" element={<AdminDashboard />} />}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
