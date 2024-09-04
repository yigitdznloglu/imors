import React, { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faHeart, faChevronDown, faMusic, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import '../App.css'

function ImörsHistory () {
  const navigate = useNavigate()
  const location = useLocation()
  const { email } = location.state || {}
  const musicListRef = useRef()
  const [displayedSongsCount, setDisplayedSongsCount] = useState(10) // Adjust as needed
  // Supposing musicList, avatar, username, uploadedSong are passed via location.state
  const { avatar, username, musicList, uploadedSong } = location.state || {} // If state is not passed, fallback to {}

  // Define the functions used in the JSX, e.g., goToGallery, handleExpandClick, handleFileChange, handleSignOut
  // These functions are just placeholders, you need to implement them based on your requirements
  const goToGallery = () => { /* implementation */ }


  const goToMyFavorites = () => {
    navigate('/MyFavorites', { state: { avatar, username, email } })
  }


  const goToHomepage = () => {
    navigate('/Homepage', { state: { avatar, username, email } })
  }

  const goToHomePage2 = () => {
    navigate('/HomePage2', { state: { avatar, username, email } })
  }



  return (
    <div className="Homepage">
      <div className="sidebar">
        <div className='logo_container'><img onClick={goToHomepage} className='homepage_img_input' src="logo.png" alt="Unloadable" /></div>

        <div className="sidebar_container3">
          <div className="sidebar_container2" onClick={goToHomePage2}>Profile</div>
          <div className="sidebar_container2">· Imörs History</div>
          <div className="sidebar_container2" onClick={goToMyFavorites}>My Favortites</div>
        </div>




      </div>
      <div className="main-content">
        <h1>profile</h1>
        <div>My Avatar:{avatar ? `${avatar}` : ""}</div>
        <div>My Username: {username ? `${username}` : ""}</div>
        <div>My Log-in Email: {email ? `${email}` : ""}</div>
      </div>

    </div >
  )
}


export default ImörsHistory

