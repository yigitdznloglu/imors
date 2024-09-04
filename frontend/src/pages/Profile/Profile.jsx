import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  FormGroup,
  FormControl,
  FormLabel,
  Container,
} from "react-bootstrap";
import "./Profile.css";

import { getThisUser } from "../../api/auth";
import { updateEmail, updateUsername, changePassword } from "../../api/user";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      const user = await getThisUser();
      setEmail(user.email);
      setUsername(user.username);
      console.log("Username:", user);
    }
    fetchUserData();
  }, []);

  const handleProfileChange = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(`Invalid password format. Password must be longer than 8 characters, 
      requires at least 1 special character, 1 number, and 1 uppercase letter.`);
      return;
    } else if (!emailRegex.test(email)) {
      setPasswordError("Invalid Email Format.");
      return;
    } else {
      setPasswordError("");
    }

    const results = await Promise.all([
      updateEmail(email),
      updateUsername(email, username),
      password
        ? changePassword(email, password)
        : Promise.resolve({ message: "No password change" }),
    ]);

    const errors = results
      .filter((res) => res.error !== "N/A")
      .map((res) => res.error);
    if (errors.length) {
      setErrors(errors);
    } else {
      setEditing(false); // Return to viewing mode after saving
    }
  };

  return (
    <div>
      <Container className="my-5">
        {editing ? (
          <Form onSubmit={handleProfileChange}>
            <h1>Edit Profile</h1>
            {errors.map((error, index) => (
              <div key={index} style={{ color: "red" }}>
                {error}
              </div>
            ))}
            <FormGroup className="mb-3">
              <FormLabel>Email</FormLabel>
              <FormControl
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "40%", color: "white" }}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Username</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: "40%", color: "white" }}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Password</FormLabel>
              <FormControl
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "40%", color: "white" }}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "40%", color: "white" }}
                required
              />
              {passwordError && (
                <div style={{ color: "red", marginTop: "0.5rem" }}>
                  {passwordError}
                </div>
              )}
            </FormGroup>

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        ) : (
          <div style={{ margin: "20px", padding: "20px", borderRadius: "8px" }}>
            <h1
              style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px" }}
            >
              Profile Information
            </h1>
            <p style={{ fontSize: "16px", margin: "10px 0" }}>
              <strong>Email:</strong> {email}
            </p>
            <p style={{ fontSize: "16px", margin: "10px 0" }}>
              <strong>Username:</strong> {username}
            </p>
            <Button
              variant="secondary"
              style={{ marginTop: "20px" }}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Profile;
