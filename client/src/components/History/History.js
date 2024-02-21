// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import Map from '../../Map/Map';
// import L from 'leaflet';

// // Custom red marker icon
// const redIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// // Define your styled components
// const SidePanel = styled.div`
//   width: 280px;
//   padding: 10px;
//   margin-right: 10px;
//   margin-top: 12px;
//   background-color: #f0f0f0;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   border-radius: 10px;
//   height: 115%;
  
// `;

// const FilterSelect = styled.select`
 
//   padding: 5px;
// `;

// const Button = styled.button`
//   margin-left : 5px;
//   padding: 8px 16px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const LoadMoreButton = styled.button`
  
//   padding: 8px 16px;
//   background-color: #28a745;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #218838;
//   }
// `;

// const ShowPreviousButton = styled.button`
//  margin:2px;
//   padding: 8px 16px;
//   background-color: #dc3545;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #c82333;
//   }
// `;

// const MapContainerWrapper = styled.div`
//   width: 100%;
//   height: 190px;
//   border-radius: 10px;
//   overflow: hidden;
//   margin-top:10px;
// `;

// const History = ({ handleLiveLocationUpdate }) => {
//     const [historyFilter, setHistoryFilter] = useState('past2hours'); // Default filter
//     const [locationHistory, setLocationHistory] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const locationsPerPage = 5;
  
//     const handleFilterChange = (filter) => {
//       console.log('Selected filter:', filter);
//       setHistoryFilter(filter);
//       setCurrentPage(1); // Reset page when filter changes
//     };
  
//     const fetchLocationHistory = () => {
//       fetch(`http://localhost:8080/history?filter=${historyFilter}`)
//         .then(response => response.json())
//         .then(data => {
//           console.log('Fetched Location History:', data);
//           setLocationHistory(data);   
//         })
//         .catch(error => {
//           console.error('Error fetching location history:', error);
//         });       
//     };
  
//     const loadMoreLocations = () => {
//       setCurrentPage(currentPage + 1);
//     };
  
//     const showPreviousLocations = () => {
//       setCurrentPage(currentPage - 1);
//     };
  
//     // Calculate the index range to display based on pagination
//     const indexOfLastLocation = currentPage * locationsPerPage;
//     const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
//     const currentLocations = locationHistory.slice(indexOfFirstLocation, indexOfLastLocation);
  
//     return (
//       <div style={{ display: 'flex', height: '170px' }}>
//         {/* Side Panel with Options */}
//         <SidePanel>
//           <div>
//             <FilterSelect value={historyFilter} onChange={(e) => handleFilterChange(e.target.value)}>
//               <option value="past2hours">Past 2 Hours</option>
//               <option value="past48hours">Past 48 Hours</option>
//               {/* Add more filter options as needed */}
//             </FilterSelect>
//             {/* Fetch Location History Button */}
//             <Button onClick={fetchLocationHistory}>Fetch</Button>
//           </div>
  
//           {/* Display fetched location data in a list */}
//           <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
//             {currentLocations.map(location => (
//               <li key={location.id} style={{ marginBottom: '2px' }}>
//                 <strong>{location.name}</strong> - Lat: {location.latitude}, Long: {location.longitude}
//               </li>
//             ))} 
//           </ul>
  
//           <div style={{ textAlign: 'center' }}>
            
//             {currentPage > 1 && ( 
//               <ShowPreviousButton onClick={showPreviousLocations}>Show Previous</ShowPreviousButton>
//             )}
//             {/* Display "Load More" button if there are more locations to fetch */}   
//             {locationHistory.length > indexOfLastLocation && (
//               <LoadMoreButton onClick={loadMoreLocations}>Load More</LoadMoreButton>
//             )}
//           </div>
//         </SidePanel>
  
//         <Map/>
//       </div>
//     );
//   };
  
//   export default History;


// import React, { useEffect, useState } from 'react';
// import Sidebar from '../Sidebar/Sidebar';
// import Map from '../../Map/Map';
// import Sidepanel from './Sidepanel';
// import { useParams } from 'react-router-dom';

// const History = () => {
//   const { tenantId, deviceId } = useParams();
//   const [locationHistory, setLocationHistory] = useState([]);

//   useEffect(() => {
//     const fetchLocationHistory = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/fetch-locations/${tenantId}/${deviceId}`);
//         const data = await response.json();
//         setLocationHistory(data);
//       } catch (error) {
//         console.error('Error fetching location history:', error);
//       }
//     };

//     fetchLocationHistory();
//   }, [tenantId, deviceId]);

//   return (
//     <>
//       <div className='sidebar'>
//         <Sidepanel />
//       </div>
//       <div className="background-container">
//         <div className="map-container">
//           {/* Pass locationHistory to the Map component for rendering */}
//           <Map />
//         </div>
//         <div className="location-history-container">
//           <h2>Location History:</h2>
//           <ul>
//             {locationHistory.map((location, index) => (
//               <li key={index}>
//                 Latitude: {location.latitude}, Longitude: {location.longitude}, Timestamp: {location.timestamp}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <div>
//         {/* Use tenantId and deviceId as needed in the History component */}
//         Tenant ID: {tenantId}, Device ID: {deviceId}
//       </div>
//     </>
//   );
// };

// export default History;



import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Map1 from './Map1'
import Sidepanel from './Sidepanel';
import { useParams } from 'react-router-dom';

const History = () => {
  const { user_id, device_id } = useParams();
  const [lH, setLocationHistory] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState('24hours'); // Default filter

  useEffect(() => {
    // Fetch location history based on tenantId and deviceId
    const fetchLocationHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/fetch-locations/${user_id}/${device_id}?filter=${selectedFilter}`);
        const data = await response.json();
        setLocationHistory(data);
      } catch (error) {
        console.error('Error fetching location history:', error);
      }
    };

    fetchLocationHistory();
  }, [user_id, device_id, selectedFilter]);

  return (
    <>
      <div className='sidebar'>
        {/* Pass locationHistory to Sidebar */}
        <Sidepanel lH={lH} user_id={user_id} device_id={device_id}/>
      </div>
      
      <div className="background-container">
        <div className="map-container">
          <Map1 locationHistory={lH} selectedFilter={selectedFilter}/>
        </div>
      </div>
    </>
  );
};

export default History;






