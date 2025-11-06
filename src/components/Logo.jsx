import React from 'react'
import logoImage from '../assets/BRM Blogger.png'

function Logo({ width = "100px" }) {
  return (
    <div className="flex items-center">
      <img 
        src={logoImage} 
        alt="BRM Blogger" 
        style={{ width }}
        className="object-contain transition-transform duration-300 hover:scale-110"
      />
    </div>
  )
}

export default Logo