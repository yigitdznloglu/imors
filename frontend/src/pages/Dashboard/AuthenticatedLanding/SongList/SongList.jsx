import React, { useEffect, useState, useRef } from "react";
import { useSelectedSong } from "../../../../context/selectedSong/SelectedSongContext";
import { TbVinyl } from "react-icons/tb";
import { getUserSongs, uploadSong, deleteSong } from "../../../../api/song";
import { Button } from "react-bootstrap";
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";

import "./SongList.css";

const Song = ({ song, onDelete }) => {
  const { setSelectedSong } = useSelectedSong();

  const handleClick = () => {
    setSelectedSong(song);
  };

  const handleDelete = async (event) => {
    const confirmed = window.confirm("Are you sure you want to delete this song?");
    if (confirmed) {
      await onDelete(song._id);
    }
  };

  return (
    <li onClick={handleClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      {song.title}
      <button onClick={handleDelete} style={{ border: 'none', background: 'none', cursor: 'pointer', marginLeft: '10px' }}>
        <IoIosRemoveCircleOutline/>
      </button>
    </li>
  );
};

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const fileInputRef = useRef(null);

  const handleAddSong = () => {
    fileInputRef.current.click();
  };

  const handleDeleteSong = async (songId) => {
    try {
      const response = await deleteSong(songId);
      console.log(response);
      setSongs(prevSongs => prevSongs.filter(song => song._id !== songId));
    } catch (error) {
      console.error("Failed to delete song in handleDeleteSong:", error);
    }
  };

  const handleFileChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const response = await uploadSong(file);
      if (response.error !== "N/A") {
        console.error("Upload error:", response.error);
      } else {
        alert("Song uploaded successfully: " + response.message);
        getUserSongs().then(({ songs }) => {
          setSongs(songs);
        });
      }
    }
  };

  useEffect(() => {
    getUserSongs()
      .then(({ songs }) => {
        setSongs(songs);
        console.log(songs);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
      });
  }, []);

  return (
    <div id="song-list">
      <div>
        <TbVinyl />
        <h2>Songs</h2>
      </div>
      <ul>
        {songs && songs.map((song) => (
          <Song key={song._id} song={song} onDelete = {handleDeleteSong}/>
        ))}
      </ul>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="audio/*"
      />
      <Button variant="info" onClick={handleAddSong}>
        <IoIosAddCircleOutline />
        Add Song
      </Button>
    </div>
  );
};

export default SongList;
