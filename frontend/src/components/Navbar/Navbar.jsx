import { isAuthenticated } from "../../context/auth/auth";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { CgProfile } from "react-icons/cg";
import { signout } from "../../context/auth/auth";

import "./Navbar.css";

export default function NavBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img src="logo.png" alt="imors logo" />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <ProfileDropdown />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function CustomLink({
  to,
  children,
  inAuthenticatedView,
  inUnauthenticatedView,
  ariaLabel,
}) {
  const userIsAuthenticated = isAuthenticated();
  const displayLink =
    (inAuthenticatedView && userIsAuthenticated) ||
    (inUnauthenticatedView && !userIsAuthenticated);

  return displayLink ? (
    <LinkContainer to={to}>
      <Nav.Link className="mx-3" aria-label={ariaLabel}>
        {children}
      </Nav.Link>
    </LinkContainer>
  ) : (
    <></>
  );
}

function ProfileDropdown() {
  const logout = () => {
    signout();
    window.location.reload();
  };
  const userIsAuthenticated = isAuthenticated();

  return userIsAuthenticated ? (
    <NavDropdown align="end" title={<CgProfile />} id="nav-dropdown-profile">
      <LinkContainer to="/profile" style={{ color: "white" }}>
        <NavDropdown.Item>Profile</NavDropdown.Item>
      </LinkContainer>
      <NavDropdown.Item onClick={logout} style={{ color: "white" }}>
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  ) : (
    <Nav className="ms-auto">
      <LinkContainer to="/auth">
        <Nav.Link>Sign Up</Nav.Link>
      </LinkContainer>
    </Nav>
  );
}
