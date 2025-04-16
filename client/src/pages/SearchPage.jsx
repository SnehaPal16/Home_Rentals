import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/List.scss";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import { useEffect, useState } from "react";
import Loader  from "../components/Loader";
import { Navbar } from "../components/Navbar";
import  ListingCard  from "../components/ListingCard";
import  Footer  from "../components/Footer";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);

  const dispatch = useDispatch();

  const getSearchListings = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/properties/search/${search}`);
      const data = response.data;

      dispatch(setListings({ listings: data }));
      setErrorMessage(null); // Clear error message if listings are found
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setErrorMessage("No listings found");
        dispatch(setListings({ listings: [] })); // Clear previous listings
      } else {
        setErrorMessage("An error occurred while fetching listings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <h1 className="title-list">{search}</h1>
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : (
        <div className="list">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listingId={listing._id}
              creator={listing.creator}
              listingPhotoPath={listing.listingPhotoPath}
              city={listing.city}
              province={listing.province}
              country={listing.country}
              category={listing.category}
              price={listing.price}
            />
          ))}
        </div>
      )}
      <Footer/>
    </>
  );
};

export default SearchPage;
