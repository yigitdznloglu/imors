import React, { useState } from "react";
import { useSelectedSong } from "../../../../../context/selectedSong/SelectedSongContext";
import { Button } from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";
import GenerateModal from "./GenerateModal/GenerateModal";
import "../Gallery.css";
import { generateVideo } from "../../../../../api/video";

const GalleryHeader = () => {
  const { selectedSong } = useSelectedSong();
  const [showModal, setShowModal] = useState(false);

  const onModalOpen = () => {
    setShowModal(true);
  };

  const onGenerate = async (model) => {
    console.log("generate", model);

    await generateVideo(selectedSong._id, model);

    setShowModal(false);
  };

  return selectedSong ? (
    <div className="gallery-header">
      <h1>{selectedSong.title}</h1>
      <Button variant="info" onClick={onModalOpen}>
        <IoIosAddCircleOutline />
      </Button>

      <GenerateModal
        show={showModal}
        onGenerate={(model) => onGenerate(model)}
        onClose={() => setShowModal(false)}
      />
    </div>
  ) : (
    <h1>Please Select a Song</h1>
  );
};

export default GalleryHeader;
