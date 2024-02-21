import React from 'react';
import Sidebar from './Sidebar';
import imgdv from '../../Images/dev.jpeg';
import imginfo from '../../Images/buy_info.jpeg';

const BuyProduct = () => {
  return (
    <>
      <Sidebar />
      <div className="flex flex-col items-start justify-start h-screen w-screen py-8 px-20 fixed">
        <h1 className="text-4xl font-bold mb-6">Buy Product</h1>
        <div className="flex flex-row justify-between w-full">
          <div className="ml-40">
            <h1 className="text-lg mb-2">Order Tracker</h1>
            <img src={imgdv} alt="Device" className="w-55 h-64 md:w-55  md:h-80 object-cover rounded-xl" />
          </div>
          <div className="mr-30">
            <h1 className="text-lg mb-8   ">Buy car device</h1>
            <img src={imginfo} alt="Buy Info" className="w-96 h-auto" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyProduct;
