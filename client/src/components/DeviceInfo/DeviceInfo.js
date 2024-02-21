import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import imgdv from "../../Images/dev.jpeg"
const DeviceInfo = () => {
  // Extract userId and deviceId from the URL using useParams
  const { userId, deviceId } = useParams();
  const [deviceInfo, setDeviceInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/device-info/${userId}/${deviceId}`);
        setDeviceInfo(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching device information');
        setLoading(false);
      }
    };

    fetchDeviceInfo();
  }, [userId, deviceId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <Sidebar />
    
    <div className="flex flex-wrap items-start justify-between h-screen w-screen py-8  fixed">
      <div className="flex flex-col ml-60 mt-20">
        <h1 className="mb-4 text-4xl font-bold">Device Information</h1>
        <p className="mb-2 text-lg">IMEI Number: {deviceInfo.device_id}</p>
        <p className="mb-2 text-lg">Date of Login: {deviceInfo.date_of_purchase}</p>
        <p className="mb-2 text-lg">Battery Percentage: {deviceInfo.battery_percentage}%</p>
        <p className="mb-2 text-lg">Signal Strength: Good/Fair/Bad</p>
        {/* Render other device information fields as needed */}
      </div>
      
      <div className="flex flex-col mr-60 mt-10">
      <img
        className="w-55 h-64 md:w-55  md:h-80 object-cover rounded-xl"
        src={imgdv}
        alt="Device"
      />
      </div>

    </div>



    </>
  );
};

export default DeviceInfo;
