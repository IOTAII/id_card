import React, { useState } from "react";
import "./Login.css";
import imglogin from "../../Images/img1.jpeg";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";

export default function Login() {
  const [values, setValues] = useState({
    user_id: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const { loginUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.role === "admin") { 
          
          navigate(`/admin/dashboard`); // Navigate to admin dashboard
        } else {
          // User login (including users with no specified role)
          loginUser({ user_id: values.user_id }); // Store the user information in context
          navigate(`/home/${values.user_id}`); // Navigate to user home page
        }
      } else {
        setErrorMsg('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMsg('Internal Server Error');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <div className="flex flex-wrap flex-col-reverse md:flex-row items-center justify-center h-screen w-screen py-8 bg-gradient-to-t from-emerald-300 to-indigo-300 fixed top-0 left-0 right-0">
      <div
        className="w-64 h-48 md:w-5/12 md:h-4/6 bg-cover text-white rounded-xl"
        style={{ backgroundImage: `url(${imglogin})` }}
      ></div>
      <div className="flex flex-col justify-center items-center flex-wrap bg-transparent rounded-lg  mb-10 p-4 md:ml-20 ">
        <div className="pb-2 border-solid border-b-2 w-full justify-center text-center mb-2">
          <h1 className="font-serif text-3xl underline text-blue-900">Log In</h1>
        </div>
        <form className="" action="post" onKeyPress={handleKeyPress}>

          <div className="pb-2">
            <label
              htmlFor="user_id"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Unique ID
            </label>
            <label className="relative text-gray-600 justify-center w-full items-center bg-white p-1 flex rounded-lg">
              <input
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, user_id: event.target.value }))
                }
                label="user_id"
                placeholder="Enter your UID"
                className="text-gray-900 sm:text-sm rounded-lg block w-full p-2 focus:outline-none"
                required=""
              />
            </label>
          </div>

          <div className="w-72">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <label className="relative text-gray-600 justify-center w-full items-center bg-white p-1 flex rounded-lg">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, password: event.target.value }))
                }
                className="text-gray-900 sm:text-sm rounded-lg block w-full p-2 focus:outline-none"
                required=""
              />
            </label>
          </div>

          <b className="">{errorMsg}</b>
          <button
            type="submit"
            onClick={handleSubmit}
            className="cta cta--is-1 custom-button"
          >
            <span>Log In</span>
          </button>

        </form>
      </div>
    </div>
  );
}
