import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import axios from "axios";

const TripList = () => {
  const listings = useSelector((state) => state.listings);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);

  console.log(userId);

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/user/${userId}/trips`
      );

      const data = await response.data;
      dispatch(setTripList(data));
      console.log(tripList);
      setLoading(false);
    } catch (err) {
      console.log("Fetch trip list failed");
    }
  };

  useEffect(() => {
    getTripList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.map(
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

export default TripList;
