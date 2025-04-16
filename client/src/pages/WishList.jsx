import React from 'react';
import "../styles/List.scss";
import { useSelector } from 'react-redux';
import {Navbar} from "../components/Navbar";
import ListingCard from '../components/ListingCard';
import Footer from '../components/Footer';

const WishList = () => {
    const wishList = useSelector((state) => state.user.wishList);
    const listings = useSelector((state) => state.listings); 

  return (
    <div>
        <Navbar/>
        <h1 className='title-list'>Your Wish List</h1>
        <div className='list'>
            {wishList?.map((wishId) => {
              const listing = listings.find((listing) => listing._id === wishId);
              if(listing){
                return(
                  <ListingCard
                    key = {listing._id}
                    listingId = {listing._id}
                    creator = {listing.creator}
                    listingPhotoPath = {listing.listingPhotoPath}
                    city = {listing.city}
                    provience = {listing.provience}
                    country = {listing.country}
                    category={listing.category}
                    price={listing.price}
                  />
                )
              }
              return null;
            })}
        </div>

        <Footer/>
    </div>
  )
}

export default WishList