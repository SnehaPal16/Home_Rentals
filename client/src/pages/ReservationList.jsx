import { useEffect, useState } from "react";
import "../styles/List.scss";
import  Loader  from "../components/Loader";
import {Navbar}  from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import axios from "axios";
import ListingCard from "../components/ListingCard";
import Footer from '../components/Footer.jsx';

const ReservationList = () => {
  const reservationList = useSelector((state) => state.user.reservationList);
  const userId = useSelector((state) => state.user._id);
  const listings = useSelector((state) => state.listings);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getReservationList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/user/${userId}/reservations`
      );
      const data = response.data;
      dispatch(setReservationList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getReservationList();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!reservationList || reservationList.length === 0) {
    return (
      <div>
        <Navbar />
        <h1 className="title-list">Your reservation List</h1>
        <p className="empty-message">No reservation found in your list.</p>
      </div>
    );
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Reservation List</h1>
      <div className="list">
        {reservationList?.map(
          ({
            _id,
            listingId,
            startDate,
            endDate,
            totalPrice,
            booking = true,
          }) => {
            const listing = listings.find((listing) => listing._id === listingId);
            if(listing){
              return(
                <ListingCard
                listingId={listing._id}
                creator={listing.creator}
                listingPhotoPath={listing.listingPhotoPath}
                city={listing.city}
                province={listing.province}
                country={listing.country}
                category={listing.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={booking}
            />
              )
            }
          }
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReservationList;