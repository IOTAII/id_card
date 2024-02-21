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
  gap: 20px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap; /* Allow wrapping */
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
    name: '',
    email_id: '',
    mob: '',
    address: '',
    date_of_purchase: '',
    invoice_number: '',
    device_id: '',
    services_offered: '',
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
      const response = await fetch('http://localhost:8080/register-device', {
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
            <Label>Name:</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </FormRow>
          <FormRow>
            <Label>Email:</Label>
            <Input type="text" name="email_id" value={formData.email_id} onChange={handleInputChange} />
            <Label>Mobile:</Label>
            <Input type="text" name="mob" value={formData.mob} onChange={handleInputChange} />
          </FormRow>
          <FormRow>
            <Label>Address:</Label>
            <Input type="text" name="address" value={formData.address} onChange={handleInputChange} />
            <Label>Date of Purchase:</Label>
            <Input type="text" name="date_of_purchase" value={formData.date_of_purchase} onChange={handleInputChange} />
          </FormRow>
          <FormRow>
            <Label>Invoice Number:</Label>
            <Input type="text" name="invoice_number" value={formData.invoice_number} onChange={handleInputChange} />
            <Label>Device ID:</Label>
            <Input type="text" name="device_id" value={formData.device_id} onChange={handleInputChange} />
          </FormRow>
          <FormRow>
            <Label>Services Offered:</Label>
            <Input type="text" name="services_offered" value={formData.services_offered} onChange={handleInputChange} />
          </FormRow>
          <SubmitButton onClick={handleSubmit}>SUBMIT</SubmitButton>
          {registrationStatus && <p>{registrationStatus}</p>}
        </FormContainer>
      </MainContentContainer>
    </>
  );
};

export default CreateUser;
