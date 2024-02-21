import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const MainContentContainer = styled.div`
  background-color: #1a202c; /* Dark black background */
  color: #ffffff;
  padding: 20px;
  height: 86vh; /* Cover entire viewport height */
  display: flex;
`;

const FormContainer = styled.div`
  margin: 40px 20px;
  width: 100%; /* Cover entire width */
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
`;

const Label = styled.label`
  width: 100px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  background-color: #343b47; /* Black background */
  color: #ffffff; /* White text */
  border-radius: 15px;
`;

const Select = styled.select`
  flex: 1;
  padding: 8px;
  background-color: #343b47; /* Black background */
  color: #ffffff; /* White text */
  border-radius: 15px;
`;

const SubmitButton = styled.button`
  background-color: #4caf50; /* Green */
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 15px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #45a049; /* Darker shade on hover */
  }
`;

const CreateUser = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    user_name: '',
    tenant_id: '',
    password: '',
    role: '0', // Default role value
  });
  const [registrationStatus, setRegistrationStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setRegistrationStatus('Registration successful');
      } else {
        setRegistrationStatus('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setRegistrationStatus('Registration failed');
    }
  };
  
  useEffect(() => {
    if (registrationStatus === 'Registration successful') {
      // Display alert dialog box
      alert('Registration successful');
      // Reload the page after displaying the alert
      window.location.reload();
    }
  }, [registrationStatus]);

  return (
    <>
      <Sidebar />
      <MainContentContainer>
        <FormContainer>
          <FormRow>
            <Label>User ID:</Label>
            <Input type="text" name="user_id" value={formData.user_id} onChange={handleInputChange} />
            <Label>User Name:</Label>
            <Input type="text" name="user_name" value={formData.user_name} onChange={handleInputChange} />
          </FormRow>
          <FormRow>
            <Label>Tenant ID:</Label>
            <Input type="text" name="tenant_id" value={formData.tenant_id} onChange={handleInputChange} />
            <Label>Password:</Label>
            <Input type="password" name="password" value={formData.password} onChange={handleInputChange} />
          </FormRow>
          <FormRow>
            <Label>Role:</Label>
            <Select name="role" value={formData.role} onChange={handleInputChange}>
              <option value="0">0</option>
              <option value="1">1</option>
            </Select>
          </FormRow>
          <SubmitButton onClick={handleSubmit}>SUBMIT</SubmitButton>
          {registrationStatus && <p>{registrationStatus}</p>}
        </FormContainer>
      </MainContentContainer>
    </>
  );
};

export default CreateUser;
