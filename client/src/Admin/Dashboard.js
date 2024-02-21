// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const ButtonContainerArrow = styled.div`
  display: flex;
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

const Input = styled.input`
  border: 1px solid white; /* Add white border */
  border-radius: 5px; /* Add border radius */
  padding: 5px; /* Add padding */
  background-color: #1a202c;
  margin: 0 4px;
`;

// Styled component for the search bar container
const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px; /* Adjust margin as needed */
`;

// Dashboard component
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [editableUserIds, setEditableUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Add state for search term
  const [filteredUsers, setFilteredUsers] = useState([]); // Add state for filtered users
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserList();
  }, [currentPage]); // Fetch user list whenever currentPage changes

  useEffect(() => {
    filterUsers(); // Filter users whenever search term changes
  }, [searchTerm, users]); // Depend on searchTerm and users

  // Function to fetch the list of users from the backend
  const fetchUserList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users');
      setUsers(response.data); // Set all users
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle pagination for user list
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prevIds) =>
      prevIds.includes(userId) ? prevIds.filter((id) => id !== userId) : [...prevIds, userId]
    );
  };

  // Function to handle update button click
  const handleUpdateButtonClick = (userId) => {
    if (editableUserIds.includes(userId)) {
      setEditableUserIds((prevIds) => prevIds.filter((id) => id !== userId));
    } else {
      setEditableUserIds((prevIds) => [...prevIds, userId]);
    }
  };

  // Function to handle done button click
  const handleDoneButtonClick = async (userId, updatedData) => {
    try {
      await axios.put(`http://localhost:8080/update-tenant/${userId}`, updatedData);
      window.location.reload();
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
    }
  };

  // Function to handle delete button click
  const handleDeleteButtonClick = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete selected users?');
    if (confirmDelete) {
      selectedUserIds.forEach(async (userId) => {
        try {
          await axios.delete(`http://localhost:8080/delete-tenant/${userId}`);
        } catch (error) {
          console.error(`Error deleting user ${userId}:`, error);
        }
      });
      window.location.reload();
    }
  };

  // Function to handle "Show User Info" button click
  const handleShowUserInfo = async (userId) => {
    try {
      navigate(`/admin/create-device/${userId}`);
    } catch (error) {
      console.error(`Error fetching user info for user ${userId}:`, error);
    }
  };

  // Function to filter users based on search term
  const filterUsers = () => {
    const filteredUsers = users.filter((user) =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(user.user_id).includes(searchTerm) ||
      String(user.tenant_id).includes(searchTerm)
    );
    setFilteredUsers(filteredUsers);
  };

  // Rendering the dashboard UI
  return (
    <>
      <Sidebar />
      <MainContentContainer>
        {/* Search bar */}
        <SearchBarContainer>
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBarContainer>
        <UserListContainer>
          <UserRow>
            <div></div>
            <div style={{ paddingRight: '120px', paddingLeft: '180px' }}>USER NAME</div>
            <div style={{ paddingRight: '120px' }}>TENANT ID</div>
            <div style={{ paddingRight: '120px' }}>PASSWORD</div>
            <div style={{ paddingRight: '120px' }}>ROLE</div>
            <div></div>
          </UserRow>
          {filteredUsers.map((user) => (
            <UserRow key={user.user_id}>
              <UserInfo>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(user.user_id)}
                  checked={selectedUserIds.includes(user.user_id)}
                />
              </UserInfo>
              {editableUserIds.includes(user.user_id) ? (
                <>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={user.user_name}
                      onChange={(e) => (user.user_name = e.target.value)}
                    />
                  </UserInfo>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={user.tenant_id}
                      onChange={(e) => (user.tenant_id = e.target.value)}
                    />
                  </UserInfo>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={user.password}
                      onChange={(e) => (user.password = e.target.value)}
                    />
                  </UserInfo>
                  <UserInfo>
                    <Input
                      type="text"
                      defaultValue={user.role}
                      onChange={(e) => (user.role = e.target.value)}
                    />
                  </UserInfo>
                </>
              ) : (
                <>
                  <UserInfo>{user.user_name}</UserInfo>
                  <UserInfo>{user.tenant_id}</UserInfo>
                  <UserInfo>{user.password}</UserInfo>
                  <UserInfo>{user.role}</UserInfo>
                </>
              )}
              <ButtonContainer>
                <Button onClick={() => handleUpdateButtonClick(user.user_id)}>
                  {editableUserIds.includes(user.user_id) ? 'CLOSE' : 'Update'}
                </Button>
                <Button onClick={() => handleShowUserInfo(user.user_id)}>Show User Info</Button>
                {editableUserIds.includes(user.user_id) && (
                  <Button
                    onClick={() =>
                      handleDoneButtonClick(user.user_id, {
                        user_name: user.user_name,
                        tenant_id: user.tenant_id,
                        password: user.password,
                        role: user.role,
                      })
                    }
                  >
                    Done
                  </Button>
                )}
              </ButtonContainer>
            </UserRow>
          ))}
        </UserListContainer>
        <ButtonContainerArrow style={{ justifyContent: 'space-between' }}>
          <ArrowButton onClick={prevPage} disabled={currentPage === 1}>
            
          </ArrowButton>
          <ArrowButton onClick={nextPage}>
            
          </ArrowButton>
        </ButtonContainerArrow>
        <CenteredButtonContainer>
          <Button onClick={handleDeleteButtonClick} disabled={selectedUserIds.length === 0}>
            Delete User
          </Button>
          <Button onClick={() => navigate('/admin/create-user')}>Create User</Button>
        </CenteredButtonContainer>
      </MainContentContainer>
    </>
  );
};

export default Dashboard;
