import React, { useState,useEffect } from 'react';
import styled from 'styled-components';

const Side = styled.div`
  width: 280px;
  padding-bottom: 10px;
  margin-right: 10px;
  margin-top: 12px;
 
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  height: 115%;
  color: white;
`;

const FilterSelect = styled.select`
  padding: 5px;
  margin-left: 10px;
  color: black;
`;

const Button = styled.button`
  margin-left: 5px;
  padding: 8px 16px;
  margin-top: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoadMoreButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const ShowPreviousButton = styled.button`
  margin: 2px;
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;


// ... (imports)

const SidebarData = ({ lH1, user_id, device_id, onFilterChange }) => {
  const [historyFilter, setHistoryFilter] = useState('24hours'); // Default filter
  const [locationHistory, setLocationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const locationsPerPage = 5;

  const handleFilterChange = (filter) => {
    console.log('Selected filter:', filter);
    setHistoryFilter(filter);
    setCurrentPage(1); // Reset page when filter changes
    onFilterChange(filter);
  };

  const fetchLocationHistory = async () => {
    try {
      
      const response = await fetch(`http://localhost:8080/fetch-location-history/${user_id}/${device_id}?filter=${historyFilter}`);
      const data = await response.json();
      setLocationHistory(data.history);
      console.log('Fetched location history:', data.history);
    } catch (error) {
      console.error('Error fetching location history:', error);
    }
  };

  const loadMoreLocations = () => {
    setCurrentPage(currentPage + 1);
  };

  const showPreviousLocations = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    // Fetch location history when the component mounts or when filter changes
    fetchLocationHistory();
  }, [historyFilter, currentPage]);

  // Calculate the index range to display based on pagination
  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = locationHistory.slice(indexOfFirstLocation, indexOfLastLocation);

  return (
    <div style={{ display: 'flex', height: '170px' }}>
      <Side>
        <div>
          <FilterSelect value={historyFilter} onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="24hours">Past 24 Hours</option>
            <option value="48hours">Past 48 Hours</option>
            <option value="6months">Past 6 months</option>
            {/* Add more filter options as needed */}
          </FilterSelect>
          {/* Fetch Location History Button */}
          <Button onClick={fetchLocationHistory}>Fetch</Button>
        </div>

        {/* Display fetched location data in a list */}
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
          {currentLocations.map(location => (
            <li key={location.id} style={{ marginBottom: '2px' }}>
              <strong>{location.name}</strong> - Lat: {location.latitude}, Long: {location.longitude}
            </li>
          ))}
        </ul>

        <div style={{ textAlign: 'center' }}>
          {currentPage > 1 && (
            <ShowPreviousButton onClick={showPreviousLocations}>Show Previous</ShowPreviousButton>
          )}
          {/* Display "Load More" button if there are more locations to fetch */}
          {locationHistory.length > indexOfLastLocation && (
            <LoadMoreButton onClick={loadMoreLocations}>Load More</LoadMoreButton>
          )}
        </div>
      </Side>
    </div>
  );
};

export default SidebarData;


