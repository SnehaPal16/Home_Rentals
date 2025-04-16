import { useState , useEffect} from 'react';
import '../styles/List.scss';
import {Navbar} from '../components/Navbar';
import { useSelector , useDispatch} from 'react-redux';
import { useParams } from 'react-router-dom';
import { setListings } from '../redux/state';
import Loader from '../components/Loader';
import ListingCard from '../components/ListingCard';
import axios from 'axios'; 
import Footer from '../components/Footer';

const CategoryPage = () => {
  const [loading , setLoading] = useState(true);
  const {category} = useParams();
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);

  const getFeedListing = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/properties?category=${category}` , 
      );

      const data = await response.data;
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListing();
  }, [category]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>
      <div className="list">
        {listings?.map((listing) => (
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

        <Footer/>
    </>
  );
}

export default CategoryPage