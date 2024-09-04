import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useSelectedSong } from "../../../../../context/selectedSong/SelectedSongContext";
import { getVideoURLs } from "../../../../../api/video";
import { deleteVideo } from "../../../../../api/video";

const GalleryGrid = () => {
  const { selectedSong } = useSelectedSong();
  const [videos, setVideos] = useState([]);

  const handleDelete = async (videoId) => {
    console.log("DELETE_VIDEO:", videoId);
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (confirmed) {
      console.log("DELETE_VIDEO:", videoId);
      await deleteVideo(videoId);
    }
  };

  useEffect(() => {
    setVideos([]);

    async function fetchVideoURLs() {
      try {
        const response = await getVideoURLs(selectedSong._id);
        if (Array.isArray(response)) {
          setVideos(response);
        } else {
          console.error("Received data is not an array:", response);
          setVideos([]);
        }
      } catch (error) {
        console.error("Failed to fetch video URLs:", error);
        setVideos([]);
      }
    }

    fetchVideoURLs();
  }, [selectedSong]);

  return (
    <Container>
      <Row xs="auto" sm="auto" md="auto" lg="auto">
        {videos.map((video, index) => (
          <Col
            key={index}
            style={{ marginBottom: "1rem", position: "relative" }}
          >
            <video controls style={{ width: "100%" }}>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Button
              variant="outline-none"
              onClick={() => handleDelete(video.id)}
              style={{
                position: "absolute",
                top: 0,
                right: "0.5rem",
                color: "white",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "1.5rem",
                fontWeight: "bold",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
              }}
              aria-label="Delete video"
            >
              &times;
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GalleryGrid;
