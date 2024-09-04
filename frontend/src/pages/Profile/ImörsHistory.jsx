import React, { useState } from 'react'
import './Profile.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faMusic, faVideo } from '@fortawesome/free-solid-svg-icons'

const ImörsHistory = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { email, username } = location.state || {}

  const historyRecords = [
    {
      modelName: 'Model A',
      songName: 'Song A',
      videoUrl: 'http://example.com/video1',
    },
    {
      modelName: 'Model B',
      songName: 'Song B',
      videoUrl: 'http://example.com/video2',
    },
    {
      modelName: 'Model C',
      songName: 'Song C',
      videoUrl: 'http://example.com/video3',
    },
  ]

  return (
    <div id="container">
      <div id="navbar">
        {/* navbar content */}
        <button
          className="sidebar-button"
          onClick={() => navigate('/Profile', { state: { username, email } })}>
          <FontAwesomeIcon icon={faLeftLong} />
        </button>
        <div className="top">
          <img src="logo.png" alt="Imörs Logo" />
        </div>
        <div>
          <div
            className="sidebar_container2"
            onClick={() =>
              navigate('/Profile', { state: { username, email } })
            }>
            Profile
          </div>
          <div className="sidebar_container2">· Imörs History</div>
          <div
            className="sidebar_container2"
            onClick={() => navigate('/MyFavorites')}>
            My Favorites
          </div>
        </div>
      </div>
      <div id="right-content">
        <h1 className="title1">Imörs History</h1>
        {historyRecords.map((record, index) => (
          <div key={index} className="history-record">
            <FontAwesomeIcon icon={faMusic} className="record-icon" />
            <div className="record-info">
              <p>Model: {record.modelName}</p>
              <p>Song: {record.songName}</p>
              <a
                href={record.videoUrl}
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon icon={faVideo} /> Watch Video
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImörsHistory
