import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Error() {
  return (
    <div className=' flex justify-center items-center h-screen flex-col p-2 '>
      <h1 className=' text-purple-900 text-8xl p-5 font-serif'>Oops!</h1>
      <h3 className=' font-bold text-black text-lg p-1'>404 - PAGE NOT FOUND</h3>
      <p className=' flex justify-center items-center p-1 flex-wrap text-center md:w-80'>The page you are looking for might have been removed had its name changed or its temporarily unavailable.</p>
      <NavLink to={"/"}>
      <button className=' p-3 bg-indigo-900 m-2 text-white rounded-full cursor-pointer hover:bg-indigo-700'>GO TO Log In</button>
      </NavLink>
    </div>
  )
}
