import React from "react";
import GalleryHeader from './GalleryHeader/GalleryHeader';
import GalleryGrid from './GalleryGrid/GalleryGrid';
import './Gallery.css'

const Gallery = () => {
    return <div id="gallery">
        <GalleryHeader />
        <GalleryGrid />
    </div>
}

export default Gallery;