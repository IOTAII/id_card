// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { io } from 'socket.io-client';

// // Custom red marker icon
// const redIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const Map = ({ selectedOption, user }) => {
//   const [realtimeLocation, setRealtimeLocation] = useState([0, 0]);

//   useEffect(() => {
//     const socket = io('http://localhost:8080');

//     socket.on('locationUpdate', (location) => {
//       setRealtimeLocation([location.latitude, location.longitude]);
//     });

//     const fetchInitialLocation = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/fetch-locations/${user.tenant_id}/${selectedOption}`);
//         const data = await response.json();

//         // Assuming the first location is the initial location
//         const initialLocation = data[0];

//         setRealtimeLocation([initialLocation.latitude, initialLocation.longitude]);  
//       } catch (error) {
//         console.error('Error fetching initial location:', error);
//       }  
//     };

//     fetchInitialLocation();

//     return () => {           
//       socket.disconnect();
//     };
//   }, [selectedOption, user]);

//   return (
//     <MapContainer center={realtimeLocation} zoom={10  } style={{ height: '100vh', width: '100%' }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={realtimeLocation} icon={redIcon}>
//         <Popup>
//           Live Location
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default Map;


// Import required libraries and components
// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { io } from 'socket.io-client';

// // Custom red marker icon
// const redIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const Map = ({ selectedOption, user }) => {
//   const [realtimeLocation, setRealtimeLocation] = useState([]);

//   useEffect(() => {
//     const socket = io('http://localhost:8080');

//     socket.on('locationUpdate', (location) => {
//       setRealtimeLocation((prevLocations) => {
//         const updatedLocations = [...prevLocations.filter(Boolean)];
//         const index = updatedLocations.findIndex(
//           (prevLocation) => prevLocation.device_id === location.device_id
//         );
//         if (index === -1) {
//           // If the location is not already in the array, add it
//           updatedLocations.push(location);
//         } else {
//           // If the location is already in the array, update it
//           updatedLocations[index] = location;
//         }
//         return updatedLocations;
//       });
//     });

//     // Fetch initial locations based on the selected option
//     const fetchInitialLocations = async () => {
//       try {
//         let apiUrl;

//         if (selectedOption) {
//           apiUrl = `http://localhost:8080/fetch-locations/${user.user_id}/${selectedOption}`;
//         } else {
//           apiUrl = `http://localhost:8080/live-locations/${user.user_id}`;
//         }

//         const response = await fetch(apiUrl);
//         const data = await response.json();

//         console.log("data",data);
//         // Ensure data is an array with valid location objects
//         if (!Array.isArray(data) || !data.every((location) => location && location.latitude && location.longitude)) {
//           console.error('Invalid data structure:', data);
//           return;
//         }

//         if (selectedOption) {
//           // Display only the selected device's marker
//           setRealtimeLocation([data[0]]);
//         } else {
//           // Display markers for all devices if allLiveLocations is an array
//           setRealtimeLocation(
//             data.map((deviceLocation) => ({
//               device_id: deviceLocation.device_id,
//               latitude: deviceLocation.latitude,
//               longitude: deviceLocation.longitude,
//             }))
//           );
          
//         }   
//       } catch (error) {
//         console.error('Error fetching initial locations:', error);
//       }
//     };

//     fetchInitialLocations();

//     return () => {
//       socket.disconnect();
//     };
//   }, [selectedOption, user]);

//   return (
//     <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//       />
//       {realtimeLocation.map((location) => (
//         <Marker key={location.device_id} position={[location.latitude, location.longitude]} icon={redIcon}>
//           <Popup>{location.device_id}</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default Map;

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = ({ selectedOption, user }) => {
  const [realtimeLocation, setRealtimeLocation] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:8080');

    socket.on('locationUpdate', (location) => {
      const latitudeStr = location.latitude.replace(/[^\d.]/g, '');
      const longitudeStr = location.longitude.replace(/[^\d.]/g, '');

      // Parse degrees and minutes from the extracted strings
      const latDegrees = parseFloat(latitudeStr.substring(0, latitudeStr.length - 7));
      const latMinutes = parseFloat(latitudeStr.substring(latitudeStr.length - 7)) / 60;

      const longDegrees = parseFloat(longitudeStr.substring(0, longitudeStr.length - 7));
      const longMinutes = parseFloat(longitudeStr.substring(longitudeStr.length - 7)) / 60;

      // Calculate latitude and longitude in decimal format
      const latitude = latDegrees + latMinutes;
      const longitude = longDegrees + longMinutes;

      if (!isNaN(latitude) && !isNaN(longitude)) {
        setRealtimeLocation((prevLocations) => {
          const updatedLocations = [...prevLocations];
          const index = updatedLocations.findIndex(
            (prevLocation) => prevLocation.device_id === location.device_id
          );
          if (index === -1) {
            // If the location is not already in the array, add it
            updatedLocations.push({ ...location, latitude, longitude });
          } else {
            // If the location is already in the array, update it
            updatedLocations[index] = { ...location, latitude, longitude };
          }
          return updatedLocations;
        });
      } else {
        console.error('Invalid latitude or longitude:', location.latitude, location.longitude);
      }
    });

    // Fetch initial locations based on the selected option
    const fetchInitialLocations = async () => {
      try {
        let apiUrl;

        if (selectedOption) {
          apiUrl = `http://localhost:8080/fetch-locations/${user.user_id}/${selectedOption}`;
        } else {
          apiUrl = `http://localhost:8080/live-locations/${user.user_id}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Ensure data is an array with valid location objects
        if (!Array.isArray(data) || !data.every((location) => location && location.latitude && location.longitude)) {
          console.error('Invalid data structure:', data);
          return;
        }

        if (selectedOption) {
          // Display only the selected device's marker
          setRealtimeLocation([data[0]]);
        } else {
          // Display markers for all devices if allLiveLocations is an array
          setRealtimeLocation(
            data.map((deviceLocation) => ({
              device_id: deviceLocation.device_id,
              latitude: parseFloat(deviceLocation.latitude),
              longitude: parseFloat(deviceLocation.longitude),
            }))
          );
        }   
      } catch (error) {
        console.error('Error fetching initial locations:', error);
      }
    };

    fetchInitialLocations();

    return () => {
      socket.disconnect();
    };
  }, [selectedOption, user]);

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {realtimeLocation.map((location) => (
        <Marker key={location.device_id} position={[location.latitude, location.longitude]} icon={redIcon}>
          <Popup>{location.device_id}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;


