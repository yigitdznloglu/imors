import React, { useEffect, useState, useCallback } from "react";
import { getThisUser, login } from "../../api/auth";
import { createUser } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../../context/auth/auth";
import "./Auth.css";
import { useUser } from "../../context/user/UserContext";
import { Form, Button } from "react-bootstrap";

const SIGNUP = "SIGNUP";
const LOGIN = "LOGIN";

const LABELS = {
  LOGIN: {
    title: "Login",
    "under-button-question": "Don't have an account?",
    option: "Signup",
  },
  SIGNUP: {
    title: "Signup",
    "under-button-question": "Already have an account?",
    option: "Login",
  },
};

const Auth = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [mode, setMode] = useState(LOGIN);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState(undefined);
  const [formatMessage, setFormatMessage] = useState(null);

  const validateSession = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await getThisUser();

      if (!response.hasOwnProperty("message")) {
        setUser({ email: response.email, username: response.username });
        navigate("/");
      } else {
        setErrorMessage(response["message"]);
      }
    } catch (error) {
      console.error("Error while validating session:", error);
      setErrorMessage("An error occurred while validating session.");
    } finally {
      setLoading(false);
    }
  }, [setUser, navigate]);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage(undefined);

    try {
      if (mode === SIGNUP) {
        const { message } = await createUser(username, email, password);
        if (message !== "User added successfully") {
          setFormatMessage(message);
        } else {
          setFormatMessage(message);
          switchMode();
        }
      } else {
        const response = await login(email, password);

        if (response.token) {
          authenticate(response.token);
          console.log(response.token);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage("An error occurred during authentication.");
    } finally {
      setLoading(false);
      validateSession();
    }
  };

  const switchMode = () => {
    if (loading) return;

    setMode(mode === SIGNUP ? LOGIN : SIGNUP);
    setErrorMessage(undefined);
  };

  return (
    <div id="auth" className="bg-dark text-white">
      <div id="auth-form-container">
        <img src="logo.png" alt="logo" />
        <Form onSubmit={handleAuth}>
          {mode === SIGNUP ? (
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Username</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                className="text-white"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          ) : (
            <></>
          )}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              size="lg"
              type="email"
              className="text-white"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              className="text-white"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {LABELS[mode].title}
          </Button>
        </Form>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {formatMessage && <p className="text-success">{formatMessage}</p>}
        <p>
          {LABELS[mode]["under-button-question"]}{" "}
          <span
            onClick={switchMode}
            className="text-primary"
            style={{ cursor: "pointer" }}
          >
            {LABELS[mode].option}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
