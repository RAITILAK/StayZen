import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/trips`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      // Log fetched data for debugging
      // console.log("Fetched trip list data:", data);
      dispatch(setTripList(data));
      setLoading(false);
    } catch (error) {
      console.log("Fetch Trip List failed!", error.message);
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
        {/* {tripList?.map((trip,index) => {const { listingId, hostId, startDate, endDate, totalPrice, booking } = trip; const { price, type } = listingId; */}

        {tripList?.map(
          ({
            listingId,
            hostId,
            startDate,
            endDate,
            totalPrice,
            booking = true,
          }) => (
            // <ListingCard
            //   key={`${listingId._id}-${index}`}
            //   listingId={listingId._id}
            //   creator={hostId._id}
            //   listingPhotoPaths={listingId.listingPhotoPaths}
            //   city={listingId.city}
            //   province={listingId.province}
            //   country={listingId.country}
            //   category={listingId.category}
            //   type={type}
            //   price={price}
            //   startDate={startDate}
            //   endDate={endDate}
            //   totalPrice={totalPrice}
            //   booking={booking} // Ensure booking status is passed correctly
            <ListingCard
              listingId={listingId._id}
              creator={hostId._id}
              listingPhotoPaths={listingId.listingPhotoPaths}
              city={listingId.city}
              province={listingId.province}
              country={listingId.country}
              category={listingId.category}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              booking={booking}
            />
          )
        )}
      </div>
    </>
  );
};

export default TripList;

// import React, { useEffect, useState } from "react";
// import "../styles/List.scss";
// import Loader from "../components/Loader";
// import Navbar from "../components/Navbar";
// import { useDispatch, useSelector } from "react-redux";
// import { setTripList } from "../redux/state";
// import ListingCard from "../components/ListingCard";

// const TripList = () => {
//   const [loading, setLoading] = useState(true);
//   const userId = useSelector((state) => state.user._id);
//   const tripList = useSelector((state) => state.user.tripList);

//   const dispatch = useDispatch();

//   const getTripList = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:3001/users/${userId}/trips`,
//         {
//           method: "GET",
//         }
//       );

//       const data = await response.json();
//       // console.log("Fetched trip list data:", data); // Log fetched data
//       dispatch(setTripList(data));
//       setLoading(false);
//     } catch (error) {
//       console.log("Fetch Trip List failed!", error.message);
//     }
//   };

//   useEffect(() => {
//     getTripList();
//   }, []);

//   return loading ? (
//     <Loader />
//   ) : (
//     <>
//       <Navbar />
//       <h1 className="title-list">Your Trip List</h1>
//       <div className="list">
//         {tripList?.map((trip, index) => {
//           // console.log("Rendering trip:", trip);
//           const { listingId, hostId, startDate, endDate, totalPrice, booking } =
//             trip;
//           const { price, type } = listingId;

//           return (
//             <ListingCard
//               key={`${listingId._id}-${index}`} // Ensure key is unique
//               listingId={listingId._id} // Pass only the string ID
//               creator={hostId._id} // Pass only the string ID
//               listingPhotoPaths={listingId.listingPhotoPaths}
//               city={listingId.city}
//               province={listingId.province}
//               country={listingId.country}
//               category={listingId.category}
//               type={type} // Ensure this is included
//               price={price} // Ensure this is included
//               startDate={startDate}
//               endDate={endDate}
//               totalPrice={totalPrice}
//               // booking={trip.booking}
//               booking={booking} // Pass the correct booking status
//             />
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default TripList;
