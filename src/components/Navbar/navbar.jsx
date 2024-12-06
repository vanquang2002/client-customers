import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import './navbar.css';
import logo from "../../assets/logo.png";

const NavigationBar = () => {
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>

        <Navbar.Brand href="/">
          <img src={logo} alt="Logo" className="logo" />
        </Navbar.Brand>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/cs1">Cơ sở Minh Khai</Nav.Link>
            <Nav.Link href="/cs2">Cơ sở Đồ Sơn</Nav.Link>
            <Nav.Link href="/cs3">Cơ sở Cát Bà</Nav.Link>
            <Nav.Link href="/services">Dịch vụ</Nav.Link>
            <Nav.Link href="/tours">Kết nối Tours</Nav.Link>
            <Nav.Link href="/addsevices">Tra cứu đơn</Nav.Link>
            <Nav.Link href="/policy">Chính sách</Nav.Link>
            <Nav.Link href="/contact">Liên hệ</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
