import React from 'react'
import {useDispatch} from 'react-redux'
import { logout } from '../../store/authSlice'
import authService from '../../appwrite/auth'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        authService.logout()
            .then(() => {
                dispatch(logout());
                navigate('/');
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    };
  return (
    <button 
      onClick={handleLogout} 
      className="inline-block px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
    >
      Logout
    </button>
  )
}

export default LogoutBtn
