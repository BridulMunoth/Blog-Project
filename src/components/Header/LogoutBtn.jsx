import React from 'react'
import {useDispatch} from 'react-redux'
import { logout } from '../../store/authSlice'
import authService from '../../appwrite/auth'

function LogoutBtn() {
    const dispatch = useDispatch();
    const handleLogout = () => {
        authService.logout()
            .then(() => {
                dispatch(logout());
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    };
  return (
    <button onClick={handleLogout} className="inline-block duration-200 hover:bg-blue-100 hover:text-blue-600 px-4 py-2 rounded-full">
      Logout
    </button>
  )
}

export default LogoutBtn
