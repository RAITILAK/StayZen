import React, { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
// import Footer from "../components/Footer"; // Ensure Footer is imported

const ListingDetails = () => {
  const { listingId } = useParams();
  console.log("Listing ID:", listingId);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const getListingDetails = async () => {
      if (!listingId) {
        console.error("No listing ID provided");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/properties/${listingId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setListing(data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch listing details failed", error.message);
        setLoading(false);
      }
    };

    getListingDetails();
  }, [listingId]);

  //booking calendar
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    //update the selection date range when user make a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0]?.startDate);
  const end = new Date(dateRange[0]?.endDate);
  const dayCount = Math.round((end - start) / (1000 * 60 * 60 * 24));

  //submit booking

  const customerId = useSelector((state) => state?.user?._id);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      console.log("Booking button clicked"); // Check if the function is triggered

      console.log("Listing Creator Data:", listing.creator);

      const bookingForm = {
        customerId,
        listingId,
        // hostId: listing.creator._id,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };
      console.log("Booking Form Data:", bookingForm); // Add this line for debugging
      console.log("Listing ID in Booking Form:", bookingForm.listingId);

      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });
      if (response.ok) {
        navigate(`/${customerId}/trips`);
      }
    } catch (error) {
      console.log("Submit Booking Failed!", error.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!listing) {
    return <div>Error loading listing details.</div>;
  }

  return (
    <>
      <Navbar />

      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item, index) => (
            <img
              key={index}
              src={`http://localhost:3001/${
                typeof item === "string" ? item.replace("public", "") : item
              }`}
              alt="Listing photo"
            />
          ))}
        </div>
        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guest - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />
        <div className="profile">
          <img
            src={`http://localhost:3001/${listing.creator?.profileImagePath?.replace(
              "public",
              ""
            )}`}
            alt="Profile"
            onError={(e) => (e.target.src = "path/to/defaultProfileImagePath")} // Provide a default image path
          />
          <h3>
            Hosted by {listing.creator?.firstName} {listing.creator?.lastName}
          </h3>
        </div>
        <hr />
        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />
        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />
        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities?.[0]?.split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              <h2>
                ${listing.price} x {dayCount}{" "}
                {dayCount > 1 ? "nights" : "night"}
              </h2>
              <h2>Total price ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0]?.startDate?.toDateString()}</p>
              <p>End Date: {dateRange[0]?.endDate?.toDateString()}</p>
              <button className="button" type="submit" onClick={handleSubmit}>
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetails;
