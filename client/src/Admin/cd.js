import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

// Styled components
const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1a202c;
  color: #ffffff;
  padding: 20px;
  position: relative;
  height: 86vh;
`;

const UserListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #333;
  padding: 10px 0;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
  margin-left: 5px;
`;

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #f5f5f5;
  font-size: 24px;
  padding: 0;
  margin: 0 10px;
`;

const CenteredButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 20px;
`;

// CreateDevice component
const CreateDevice = () => {
  const { userId } = useParams();
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/devices/${userId}`);
        setDeviceData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching device data:', error.message);
        setError('Device data not found');
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Sidebar />
      <MainContentContainer>
        <UserListContainer>
          <UserRow>
            <div style={{ paddingRight: '120px', paddingLeft: '180px' }}>NAME</div>
            <div style={{ paddingRight: '120px' }}>EMAIL</div>
            <div style={{ paddingRight: '120px' }}>MOBILE</div>
            <div style={{ paddingRight: '120px' }}>ADDRESS</div>
            <div style={{ paddingRight: '120px' }}>DATE OF PURCHASE</div>
            <div style={{ paddingRight: '120px' }}>INVOICE NUMBER</div>
            <div style={{ paddingRight: '120px' }}>DEVICE ID</div>
            <div>SERVICES OFFERED</div>
          </UserRow>
          {deviceData.map((device, index) => (
            <UserRow key={index}>
              <UserInfo>{device.name}</UserInfo>
              <UserInfo>{device.email_id}</UserInfo>
              <UserInfo>{device.mob}</UserInfo>
              <UserInfo>{device.address}</UserInfo>
              <UserInfo>{device.date_of_purchase}</UserInfo>
              <UserInfo>{device.invoice_number}</UserInfo>
              <UserInfo>{device.device_id}</UserInfo>
              <UserInfo>{device.services_offered}</UserInfo>
            </UserRow>
          ))}
        </UserListContainer>
        <CenteredButtonContainer>
          <Button onClick={() => navigate('/admin/create-device')}>Back</Button>
        </CenteredButtonContainer>
      </MainContentContainer>
    </>
  );
};

export default CreateDevice;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

// Styled components and CSS styles
const MainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1a202c; /* Dark black background */
  color: #ffffff;
  padding: 20px;
  position: relative;
  height: 86vh; /* Cover entire viewport height */
`;

const UserListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #333;
  padding: 10px 0;
  justify-content : space-between;
`;

const UserInfo = styled.div`
  flex: 1;
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;
const Button = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
  margin-left: 5px;
`;
const CenteredButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 20px;
`;

const Input = styled.input`
  border: 1px solid white; /* Add white border */
  border-radius: 5px; /* Add border radius */
  padding: 5px; /* Add padding */
  background-color: #1a202c;
  margin: 0 4px;
`;

// CreateDevice component
const CreateDevice = () => {
  const { userId } = useParams();
  const [deviceData, setDeviceData] = useState([]);
  const [editableDeviceIds, setEditableDeviceIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeviceData();
  }, [userId]);

  // Function to fetch device data for the given user ID
  const fetchDeviceData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/devices/${userId}`);
      setDeviceData(response.data);
    } catch (error) {
      console.error('Error fetching device data:', error.message);
    }
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (deviceId) => {
    setEditableDeviceIds((prevIds) =>
      prevIds.includes(deviceId) ? prevIds.filter((id) => id !== deviceId) : [...prevIds, deviceId]
    );
  };

  // Function to handle update button click
  const handleUpdateButtonClick = (deviceId) => {
    setEditableDeviceIds((prevIds) =>
      prevIds.includes(deviceId) ? prevIds.filter((id) => id !== deviceId) : [...prevIds, deviceId]
    );
  };

  // Function to handle "Show Device Info" button click
  const handleShowDeviceInfo = (deviceId) => {
    navigate(`/admin/create-device/${deviceId}`);
  };

  // Rendering the CreateDevice UI
  return (
    <>
      <Sidebar />
      <MainContentContainer>
        <UserListContainer>
          {/* Render the headers */}
          <UserRow>
            <div>USER NAME</div>
            <div>EMAIL</div>
            <div>MOBILE</div>
            <div>ADDRESS</div>
            <div>DATE OF PURCHASE</div>
            <div>INVOICE NUMBER</div>
            <div>DEVICE ID</div>
            <div>SERVICES OFFERED</div>
          </UserRow>
          {/* Render the device data */}
          {deviceData.map((device, index) => (
            <UserRow key={index}>
              <UserInfo>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(device.device_id)}
                  checked={editableDeviceIds.includes(device.device_id)}
                />
              </UserInfo>
              {editableDeviceIds.includes(device.device_id) ? (
                <>
                  {/* Render input fields if editable */}
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={device.email_id}
                      onChange={(e) => (device.email_id = e.target.value)}
                    />
                  </UserInfo>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={device.mob}
                      onChange={(e) => (device.mob = e.target.value)}
                    />
                  </UserInfo>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={device.address}
                      onChange={(e) => (device.address = e.target.value)}
                    />
                  </UserInfo>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={device.date_of_purchase}
                      onChange={(e) => (device.date_of_purchase = e.target.value)}
                    />
                  </UserInfo>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={device.invoice_number}
                      onChange={(e) => (device.invoice_number = e.target.value)}
                    />
                  </UserInfo>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={device.device_id}
                      onChange={(e) => (device.device_id = e.target.value)}
                    />
                  </UserInfo>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={device.services_offered}
                      onChange={(e) => (device.services_offered = e.target.value)}
                    />
                  </UserInfo>
                </>
              ) : (
                <>
                  {/* Render data if not editable */}
                  <UserInfo>{device.email_id}</UserInfo>
                  <UserInfo>{device.mob}</UserInfo>
                  <UserInfo>{device.address}</UserInfo>
                  <UserInfo>{device.date_of_purchase}</UserInfo>
                  <UserInfo>{device.invoice_number}</UserInfo>
                  <UserInfo>{device.device_id}</UserInfo>
                  <UserInfo>{device.services_offered}</UserInfo>
                </>
              )}
              {/* Render buttons */}
              <ButtonContainer>
                <Button onClick={() => handleUpdateButtonClick(device.device_id)}>
                  {editableDeviceIds.includes(device.device_id) ? 'CLOSE' : 'Update'}
                </Button>
                <Button onClick={() => handleShowDeviceInfo(device.device_id)}>Show Device Info</Button>
              </ButtonContainer>
            </UserRow>
          ))}
        </UserListContainer>
        <CenteredButtonContainer>
          <Button>
            Delete Device
          </Button>
          <Button onClick={() => navigate('/admin/create-user')}>Create Device</Button>
        </CenteredButtonContainer>
      </MainContentContainer>
    </>
  );
};

export default CreateDevice;
