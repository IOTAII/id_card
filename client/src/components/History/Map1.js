import React, { useEffect, useState } from 'react';
import { MapContainer,Marker,Popup, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map1 = ({ locationHistory }) => {
  const [realtimeLocation, setRealtimeLocation] = useState([]);

  useEffect(() => {
    setRealtimeLocation(locationHistory);
  }, [locationHistory]);

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
      {/* Display Polyline to connect the markers based on location history */}
      <Polyline
        positions={realtimeLocation.map((location) => [location.latitude, location.longitude])}
        color="black"
      />
    </MapContainer>
  );
};

export default Map1;
