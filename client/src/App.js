// App.js
import React from "react";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import History from "./components/History/History";
import Error from "./components/Error/Error";
import DeviceInfo from "./components/DeviceInfo/DeviceInfo";
import BuyProduct from "./components/BuyProduct/BuyProduct";
import Dashboard from "./Admin/Dashboard";
import CreateUser from "./Admin/CreateUser"
import CreateDevice from "./Admin/CreateDevice";
import CreateDeviceForm from "./Admin/CreateDeviceForm";
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} exact />
        {/* <Route path="signup" element={<Signup />} exact /> */}
        <Route path="/home/:user_id" element={<Home />} />
        <Route path="/history/:user_id/:device_id" element={<History/>} />
        <Route path="/device-info/:userId/:deviceId" element={<DeviceInfo />} />
        <Route path="/another-device-info/:userId/:deviceId" element={<BuyProduct />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/admin/create-device/:userId" element={<CreateDevice />} />
        <Route path = "/admin/register-devices" element={<CreateDeviceForm/>}/>
        <Route path="/error" element={<Error/>} />
      </Routes>
    </div>
  );
}
