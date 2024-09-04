import React, { useState, useRef } from 'react'
import './Profile.css'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong } from '@fortawesome/free-solid-svg-icons'

const MyFavorites = ({ email, username }) => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const goToImörsHistory = () => {
    navigate('/ImörsHistory')
  }

  const goToProfile = () => {
    navigate('/Profile')
  }
  const [avatar, setAvatar] = useState(() => {
    const savedAvatar = localStorage.getItem('avatar')
    return savedAvatar || 'user.png'
  })


  const [isHovering, setIsHovering] = useState(false)

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const goToAuth = () => {
    navigate('/Auth')
  }

  return (
    <div id="container">
      <div id="navbar">
        <button className="sidebar-button" onClick={goToAuth}>
          <FontAwesomeIcon icon={faLeftLong} />
        </button>
        <div className="top">
          <img src="logo.png" alt="logo"></img>
        </div>
        <div>
          <div className="sidebar_container2" onClick={goToProfile}>
            Profile
          </div>
          <div className="sidebar_container2" onClick={goToImörsHistory}>
            Imörs History
          </div>
          <div className="sidebar_container2">· My Favortites</div>
        </div>
      </div>
      <div id="right-content">
        <h1 className="title1">My Favorties</h1>
      </div>
    </div>
  )
}

export default MyFavorites
