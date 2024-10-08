import React from "react";

import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/store";
import MapComponent from "./Map";
import MapWithPopulation from "./Map";
import MapWithoutPopulation from "./Map_NZ";


export default function HomePage(){
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = ()=>{
    dispatch(logout());
    navigate('/signin');
  };
  return (
    <div className="bg-sky-500 font-bold underline">
      
      <Link to={'/signin'}>Sign In</Link>
      <button onClick={handleLogout}>Sign out</button>
      <MapWithPopulation/>
    </div>
  );
}