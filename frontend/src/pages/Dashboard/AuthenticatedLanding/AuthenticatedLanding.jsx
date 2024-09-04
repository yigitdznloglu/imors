import React from "react";
import SongList from "./SongList/SongList";
import Gallery from "./Gallery/Gallery";
import { SelectedSongProvider } from "../../../context/selectedSong/SelectedSongContext";

const AuthenticatedLanding = () => {
    return <SelectedSongProvider>
        <SongList />
        <Gallery />
    </SelectedSongProvider>
}

export default AuthenticatedLanding;