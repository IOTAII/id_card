import React, { useState } from "react";
import "./Signup.css";
import imglogin from "../../Images/img1.jpeg";
import { Link } from "react-router-dom";

export default function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
    role: "User", // Set the default role to "Admin"
    adminCode: "", // Additional field for the admin role
    adharNumber: "", // Common field for both roles
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = () => {
    // Check if a role is selected
    if (!values.role) {
      setErrorMsg("Select a role");
      return;
    }

    // Check for additional fields based on the selected role
    if (values.role === "Admin" && !values.adminCode) {
      setErrorMsg("Enter Admin Code");
      return;
    }

    // Continue with the signup process, associating the user with the selected role
    // For simplicity, I'm logging the user data here, replace this with your actual signup logic
    console.log("User Signup Data:", values);

    setErrorMsg(""); // Reset error message
  };

  // Additional fields for the admin role
  const adminFields = (
    <div>
      <div className="w-72">
        <label
          htmlFor="adminCode"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Admin Code
        </label>
        <label className="relative text-gray-600 justify-center w-full items-center bg-white p-1 flex rounded-lg">
              
              <input
               onChange={(event) =>
                setValues((prev) => ({ ...prev, email: event.target.value }))
              }
              type="email"
              label="Admin Code"
              class=" text-gray-900 sm:text-sm rounded-lg block w-full p-2  focus:outline-none"
              placeholder="Enter your Admin Code"
              required=""
            />
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap flex-col-reverse md:flex-row items-center justify-center h-screen w-screen py-8 bg-gradient-to-t from-emerald-300 to-indigo-300 fixed top-0 left-0 right-0">
      <div
        className="w-64 h-48 md:w-5/12 md:h-4/6 bg-cover text-white rounded-xl"
        style={{ backgroundImage: `url(${imglogin})` }}
      ></div>
      <div className="flex flex-col justify-center items-center flex-wrap bg-transparent rounded-lg  mb-10 p-4 md:ml-20 ">
        <div className="pb-2 border-solid border-b-2 w-full justify-center text-center mb-2">
          <h1 className="font-serif text-3xl underline text-blue-900">Sign Up</h1>
        </div>
        <form className="" action="post">
          {/* Role selection dropdown */}
          <div className="pb-2">
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Select Role
            </label>
            <select
              className="relative text-gray-600 justify-center w-full items-center bg-white p-1 flex rounded-lg"
              value={values.role}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, role: event.target.value }))
              }
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Additional fields based on role */}
          {values.role === "Admin" && adminFields}

          {/* Common fields */}
          <div className="pb-2">
            <label
              htmlFor="adharNumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Adhar Number
            </label>
            <label className="relative text-gray-600 justify-center w-full items-center bg-white p-1 flex rounded-lg">
              
                <input
                onChange={(event) =>
                    setValues((prev) => ({ ...prev, email: event.target.value }))
                }
                label="Adhar Number"
                placeholder="Enter Adhar number"
                class=" text-gray-900 sm:text-sm rounded-lg block w-full p-2  focus:outline-none"
                
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
                  setValues((prev) => ({ ...prev, pass: event.target.value }))
                }
                className="text-gray-900 sm:text-sm rounded-lg block w-full p-2 focus:outline-none"
                required=""
              />
            </label>
          </div>

          <b className="">{errorMsg}</b>
          <button
            type="button" // Change to "button" to prevent form submission
            onClick={handleSignup}
            className="cta cta--is-1 custom-button"
          >
            <span>Sign Up</span>
          </button>
          <p className="text-sm font-light text-gray-500 pt-4">
            Already have an account?
            <Link
              to={"/"}
              className="font-medium text-blue-600 hover:underline pl-1"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
