import React, { useState } from 'react';
import "../styles/listingCard.scss";
import {ArrowForwardIos , ArrowBackIosNew , Favorite} from "@mui/icons-material";
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector , useDispatch} from 'react-redux';
import { setWishList } from "../redux/state";
import axios from 'axios';

const ListingCard = ({
    listingId,
    creator,
    listingPhotoPath,
    city,
    provience,
    country,
    category,
    type,
    price,
    startDate,
    endDate,
    totalPrice,
    booking
  }) => {

    const [currentIndex , setCurrentIndex] = useState(0);
    const goToPrevSlide = () => {
      setCurrentIndex(
        (prevIndex) => 
          (prevIndex - 1 + listingPhotoPath.length) % listingPhotoPath.length
      );    
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPath.length)
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // WISHLIST
  
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];
  // const isLiked = false;

  const isLiked = wishList.find((itemId) => {return itemId === listingId});

  const getWishListing = async() => {
    if(!user?._id || !listingId){
      console.error("Invalid user ID or listing ID");
      return;
    }
     try{
      const response = await axios.post(`http://localhost:8080/user/${user._id}/${listingId}`);

      const data = response.data;
      dispatch(setWishList(data.wishList));
    }
    catch(error){
      console.error("Error in getWishListing : " , error.response?.data || error.message);
    }
  }


    return (
      <div className='listing-card' onClick={() => {
        navigate(`/properties/${listingId}`)
      }}>
        <div className='slider-container'>
          <div className='slider' style={{transform : `translateX(-${currentIndex * 100}%)`}}>
            {listingPhotoPath?.map((photo , index) => (
              <div key={index} className='slide'>
                <img
                 src={`http://localhost:8080/${photo.replace("public" , "")}`}
                 alt={`photo${index+1}`}
                />

                <div className='prev-button' onClick={(e) => {e.stopPropagation() 
                   goToPrevSlide(e)}}>
                  <ArrowBackIosNew sx={{fontSize : "15px"}}/>
                </div>
                <div className='next-button' onClick={(e) => {e.stopPropagation() 
                  goToNextSlide(e)}}>
                  <ArrowForwardIos sx={{fontSize : "15px"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3>{city} , {provience} , {country}</h3>

        <p>{category}</p>
        {!booking ? (
          <>
            <p>{type}</p>
            <p>
              <span>${price}</span> per night
            </p>
          </>
          ) : (
          <>
            <p>
              {startDate} - {endDate}
            </p>
            <p>
              <span>${totalPrice}</span> total
            </p>
          </>
        )}

        <button
          className="favorite"
          onClick={(e) => {
            e.stopPropagation();
            getWishListing();
          }}
          disabled={!user}
          >
          {isLiked ? (
            <Favorite sx={{ color: "red" }} />
          ) : (
            <Favorite sx={{ color: "white" }} />
          )}
        </button>

      </div>
    )
}

export default ListingCard