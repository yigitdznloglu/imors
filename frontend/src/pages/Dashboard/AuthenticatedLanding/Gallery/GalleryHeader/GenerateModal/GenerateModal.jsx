import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "../../Gallery.css";

const MODEL_OPTIONS = [
  "mapdreamer",
  "drawing",
  "micro",
  "modern",
  "wildlife",
  "japan",
];

const GenerateModal = ({ show, onGenerate, onClose }) => {
  const [selectedModel, setSelectedModel] = useState(undefined);

  return (
    <Modal
      show={show}
      size="lg"
      onHide={onClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Generate Video for the Song
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Select a Model:</Form.Label>
            <div>
              {MODEL_OPTIONS.map((option, idx) => (
                <Form.Check
                  inline
                  type="radio" // This specifies the type as 'radio'
                  label={
                    <img
                      src={`/models/${option}.gif`}
                      alt={`GIF for ${option}`}
                      style={{ width: "20rem", height: "20rem" }}
                    />
                  }
                  name="modelSelection" // Ensure all radio inputs have the same 'name'
                  id={`modelRadio${idx}`}
                  value={option}
                  checked={selectedModel === option}
                  onChange={() => setSelectedModel(option)}
                />
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => onGenerate(selectedModel)}>
          Generate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GenerateModal;
