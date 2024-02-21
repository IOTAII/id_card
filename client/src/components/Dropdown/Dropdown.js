import React, { useState } from 'react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { FaBatteryQuarter } from 'react-icons/fa';
import { MdCall } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

function Dropdown({ options, setSelectedOption, selectedOption, user_id }) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('Select Device');
  const navigate = useNavigate();

  const handleDropdownChange = (option) => {
    setDisplayValue(option);
    setIsOpen(false);
    
    // Use the state updater function callback to ensure the state is updated
    setSelectedOption((prevOption) => {
      // Log the updated selected option
      console.log('Updated Selected Option:', prevOption);
      return option;
    });
  };
  

  const handleTrackingHistoryClick = () => {
    // Use displayValue directly to get the selected option
    const selectedOption = displayValue;
  
    console.log('Clicked Tracking History');
    console.log('Selected Option:', selectedOption);
    console.log('User ID:', user_id);
  
    if (selectedOption) {
      navigate(`/history/${encodeURIComponent(user_id)}/${encodeURIComponent(selectedOption)}`);
    }
  };
  
  return (
    <>
      <div className='relative flex flex-col items-center w-[260px] h-[200px] rounded-lg'>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className='bg-white text-amber-950 p-4 w-full flex items-center justify-between font-bold text-lg rounded-lg border-2 border-amber-950 active:border-blue-800 duration-300 active:text-blue-800'
        >
          {displayValue}
          {isOpen ? <AiOutlineCaretUp className='h-8' /> : <AiOutlineCaretDown className='h-8' />}
        </button>

        {isOpen && (
          <div className="bg-black text-white absolute top-20 flex flex-col items-start rounded-lg p-2 w-full">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleDropdownChange(option)}
                className='flex text-white w-full justify-between p-4 hover:bg-slate-500 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4'
              >
                <h3><MdCall /></h3>
                <h3 className='font-bold text-white'>{option}</h3>
                <h3><FaBatteryQuarter /></h3>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='relative flex flex-col items-center w-[260px] h-[200px] rounded-lg mt-4'>
        {/* Use Link with onClick for Tracking History */}
        <button
         
          onClick={handleTrackingHistoryClick}
          className='bg-white text-amber-950 p-4 w-full flex items-center justify-between font-bold text-lg rounded-lg border-2 border-amber-950 active:border-blue-800 duration-300 active:text-blue-800'
        >
          Tracking History
        </button>
      </div>
    </>
  );
}

export default Dropdown;
