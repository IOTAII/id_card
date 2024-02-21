import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
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
  
  > * {
    flex: 1;
    &:first-child {
      flex: 0;
      margin-right: 10px; /* Add margin to the right of the checkbox */
      margin-left:10px;
    }
  }
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
  width: 100px;
`;

// CreateDevice component
const CreateDevice = () => {
  const { userId } = useParams();
  const [devices, setDevices] = useState([]);
  const [editableDeviceIds, setEditableDeviceIds] = useState([]);
  const [editableFields, setEditableFields] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeviceData();
  }, [userId]);

  // Function to fetch device data for the given user ID
  const fetchDeviceData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/devices/${userId}`);
      console.log('Device data:', response.data); // Log the received data
      setDevices(response.data);
      // Initialize editable fields state for each device
      const initialEditableFields = {};
      response.data.forEach((device) => {
        initialEditableFields[device.user_id] = false;
      });
      setEditableFields(initialEditableFields);
    } catch (error) {
      console.error('Error fetching device data:', error.message);
    }
  };

  // Function to handle checkbox change
  // Function to handle checkbox change
const handleCheckboxChange = (deviceId) => {
  setEditableDeviceIds((prevIds) =>
    prevIds.includes(deviceId) ? prevIds.filter((id) => id !== deviceId) : [...prevIds, deviceId]
  );
};

  // Function to handle update button click and toggle editable state of fields
  const handleUpdateButtonClick = (userId) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [userId]: !prevFields[userId],
    }));
  };

  // Function to handle "Done" button click and send updated data to server
  const handleDoneButtonClick = async (userId, updatedData) => {
    try {
      await axios.put(`http://localhost:8080/update-user/${userId}`, updatedData);
      // After updating the data, refresh the page to display the new data
      window.location.reload();
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
    }
  };

  // Function to handle delete button click
  // Function to handle delete button click
const handleDeleteButtonClick = async () => {
  const confirmDelete = window.confirm('Are you sure you want to delete selected devices?');
  if (confirmDelete) {
    try {
      // Iterate through checked devices and send DELETE requests
      await Promise.all(
        editableDeviceIds.map(async (deviceId) => {
          await axios.delete(`http://localhost:8080/delete-user/${userId}?device_id=${deviceId}`);
        })
      );

      // After deletion, refresh the device data
      fetchDeviceData();
    } catch (error) {
      console.error('Error deleting devices:', error.message);
    }
  }
};

  // Function to handle "Create Device" button click
  const handleCreateDeviceClick = () => {
    navigate('/admin/register-devices');
  };

  // Render the CreateDevice UI
  return (
    <>
      <Sidebar />
      <MainContentContainer>
        <UserListContainer>
          {/* Render the headers */}
          <UserRow>
            <div></div>
            <div>USER NAME</div>
            <div>EMAIL</div>
            <div>MOBILE</div>
            <div>ADDRESS</div>
            <div>DATE OF PURCHASE</div>
            <div>INVOICE NUMBER</div>
            <div>DEVICE ID</div>
            <div>SERVICES OFFERED</div>
            <div></div>
          </UserRow>
          {/* Render the device data */}
          {devices.map((device) => (
            <UserRow key={device.user_id}>
              <UserInfo>
                <input
  type="checkbox"
  onChange={() => handleCheckboxChange(device.device_id)}
  checked={editableDeviceIds.includes(device.device_id)}
/>

              </UserInfo>
              {/* Render other data with conditional rendering for editable fields */}
              <UserInfo>{editableFields[device.user_id] ? (
                <Input
                  type="text"
                  value={device.name}
                  onChange={(e) => setDevices(devices.map((d) => (d.user_id === device.user_id ? { ...d, name: e.target.value } : d)))}
                />
              ) : device.name}</UserInfo>

              <UserInfo>{editableFields[device.user_id] ? (
                <Input
                  type="text"
                  value={device.email_id}
                  onChange={(e) => setDevices(devices.map((d) => (d.user_id === device.user_id ? { ...d, email_id: e.target.value } : d)))}
                />
              ) : device.email_id}</UserInfo>

              <UserInfo>{editableFields[device.user_id] ? (
                <Input
                  type="text"
                  value={device.mob}
                  onChange={(e) => setDevices(devices.map((d) => (d.user_id === device.user_id ? { ...d, mob: e.target.value } : d)))}
                />
              ) : device.mob}</UserInfo>

              <UserInfo>{editableFields[device.user_id] ? (
                <Input
                  type="text"
                  value={device.address}
                  onChange={(e) => setDevices(devices.map((d) => (d.user_id === device.user_id ? { ...d, address: e.target.value } : d)))}
                />
              ) : device.address}</UserInfo>

              <UserInfo>{editableFields[device.user_id] ? (
                <Input
                  type="text"
                  value={device.date_of_purchase}
                  onChange={(e) => setDevices(devices.map((d) => (d.user_id === device.user_id ? { ...d, date_of_purchase: e.target.value } : d)))}
                />
              ) : device.date_of_purchase}</UserInfo>

              <UserInfo>{editableFields[device.user_id] ? (
                <Input
                  type="text"
                  value={device.invoice_number}
                  onChange={(e) => setDevices(devices.map((d) => (d.user_id === device.user_id ? { ...d, invoice_number: e.target.value } : d)))}
                />
              ) : device.invoice_number}</UserInfo>

              <UserInfo>{editableFields[device.user_id] ? (
                <Input
                  type="text"
                  value={device.device_id}
                  onChange={(e) => setDevices(devices.map((d) => (d.user_id === device.user_id ? { ...d, device_id: e.target.value } : d)))}
                />
              ) : device.device_id}</UserInfo>

              <UserInfo>{editableFields[device.user_id] ? (
                <Input
                  type="text"
                  value={device.services_offered}
                  onChange={(e) => setDevices(devices.map((d) => (d.user_id === device.user_id ? { ...d, services_offered: e.target.value } : d)))}
                />
              ) : device.services_offered}</UserInfo>

              <ButtonContainer>
                <Button onClick={() => handleUpdateButtonClick(device.user_id)}>
                  {editableFields[device.user_id] ? 'CLOSE' : 'Update'}
                </Button>
                {editableFields[device.user_id] && ( // Only render the "Done" button when in edit mode
                  <Button onClick={() => handleDoneButtonClick(device.user_id, device)}>
                    Done
                  </Button>
                )}
              </ButtonContainer>
            </UserRow>
          ))}
        </UserListContainer>
        <CenteredButtonContainer>
          <Button onClick={handleDeleteButtonClick}>Delete Device</Button>
          <Button onClick={handleCreateDeviceClick}>Create Device</Button>
        </CenteredButtonContainer>
      </MainContentContainer>
    </>
  );
};

export default CreateDevice;
