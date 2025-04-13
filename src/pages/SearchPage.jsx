// import React, { useEffect, useState } from "react";
// import "../styles/List.scss";
// import Navbar from "../components/Navbar";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setListings } from "../redux/state";
// import Loader from "../components/Loader";
// import ListingCard from "../components/ListingCard";

// const SearchPage = () => {
//   const [loading, setLoading] = useState(true);
//   const { search } = useParams();
//   const listings = useSelector((state) => state.listings || []);

//   const dispatch = useDispatch();

//   const getSearchListings = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:3001/properties/search/${search}`,
//         {
//           method: "GET",
//         }
//       );
//       const data = await response.json();
//       dispatch(setListings({ listings: data }));
//       setLoading(false);
//     } catch (error) {
//       console.log("Fetch searched l;ist failedf!", error.message);
//     }
//   };

//   useEffect(() => {
//     getSearchListings();
//   }, [search]);

//   return loading ? (
//     <Loader />
//   ) : (
//     <>
//       <Navbar />
//       <h1 className="title-list">{search}</h1>
//       <div className="list">
//         {listings?.map(
//           ({
//             _id,
//             creator,
//             listingPhotoPaths,
//             city,
//             province,
//             country,
//             category,
//             type,
//             price,
//             booking = false,
//           }) => (
//             <ListingCard
//               listingId={_id}
//               creator={creator}
//               listingPhotoPaths={listingPhotoPaths}
//               city={city}
//               province={province}
//               country={country}
//               category={category}
//               type={type}
//               price={price}
//               booking={booking}
//             />
//           )
//         )}
//       </div>
//     </>
//   );
// };

// export default SearchPage;

import React, { useEffect, useState } from "react";
import "../styles/List.scss";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";
import ListingCard from "../components/ListingCard";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const listings = useSelector((state) =>
    Array.isArray(state.listings) ? state.listings : []
  );

  const dispatch = useDispatch();

  const getSearchListings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/search/${search}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        dispatch(setListings({ listings: data }));
      } else {
        console.error("Expected an array but got:", data);
      }

      setLoading(false);
    } catch (error) {
      console.log("Fetch search list failed!", error.message);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{search}</h1>
      <div className="list">
        {listings.map(
          ({
            _id,
            creator,
            listingPhotoPaths,
            city,
            province,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              key={_id} // Make sure to add a unique key
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          )
        )}
      </div>
    </>
  );
};

export default SearchPage;
