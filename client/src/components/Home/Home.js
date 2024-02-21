// Home.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Dropdown from '../Dropdown/Dropdown';
import { useUser } from '../../context/userContext';
import Map from '../../Map/Map';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useUser();
  const [deviceIds, setDeviceIds] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  useEffect(() => {
    const fetchDeviceIds = async () => {
      try {
        const response = await fetch(`http://localhost:8080/devices/${user.user_id}`);
        const data = await response.json();

        const ids = data.map((device) => device.device_id);
        setDeviceIds(ids);
      } catch (error) {
        console.error('Error fetching device ids:', error);
      }
    };

    if (user && user.user_id) {
      fetchDeviceIds();
    }
  }, [user]);

  const handleDropdownChange = (option) => {
    setSelectedOption(option);
    setSelectedDeviceId(option); // Update selected device ID
  };

  return (
    <>
      <div className='sidebar'>
        <Sidebar userId={user.user_id} deviceId={selectedDeviceId} /> {/* Pass selected device ID to Sidebar */}
      </div>
      <div className="background-container">
        <div className="dropdown-container">
          <Dropdown options={deviceIds} setSelectedOption={handleDropdownChange} user_id={user.user_id} />
        </div>
        <div className="map-container">
          <Map selectedOption={selectedOption} user={user} />
        </div>
      </div>
      <div className='relative flex flex-col items-center w-[260px] h-[200px] rounded-lg mt-4'>
        <Link to={`/history/${user.user_id}/${selectedOption}`} className='bg-white text-amber-950 p-4 w-full flex items-center justify-between font-bold text-lg rounded-lg border-2 border-amber-950 active:border-blue-800 duration-300 active:text-blue-800'>
          Tracking History
        </Link>
      </div>
    </>
  );
};

export default Home;
