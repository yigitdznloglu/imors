import React, { createContext, useState, useContext } from 'react';

const SelectedSongContext = createContext();

export const useSelectedSong = () => useContext(SelectedSongContext);

export const SelectedSongProvider = ({ children }) => {
    const [selectedSong, setSelectedSong] = useState(null);

    const changeSong = (newSelectedSong) => {
        setSelectedSong(newSelectedSong);
    };

    return (
        <SelectedSongContext.Provider value={{ selectedSong, setSelectedSong, changeSong }}>
            {children}
        </SelectedSongContext.Provider>
    );
};