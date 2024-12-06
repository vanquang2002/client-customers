import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './contact.css';
import logo from '../../assets/logo.png';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
  };

  return (
    <Container className="contact-page-container mt-4">
      <h1>Liên hệ với chúng tôi</h1>
      <Row>
        {/* Left Column - Contact Information */}
        <Col md={6} className="contact-info mb-4">

          <div>
            <img src={logo} alt="Logo" style={{ width: '75%', height: 'auto', display: 'block' }} />
            <br />
            <p><strong>Address:</strong> Số 16 Minh Khai, Hồng Bàng - TP Hải Phòng</p>
            <p><strong>Lễ tân cơ sở Minh Khai:</strong> 022 5374 5766</p>
            <p><strong>Lễ tân cơ sở Đồ Sơn:</strong> 022 5386 6386</p>
            <p><strong>Lễ tân cơ sở Cát Bà:</strong> 022 5388 7381</p>
            <p><strong>Email:</strong> <a href="mailto:huongsen.16minhkhai.hp@gmail.com">huongsen.16minhkhai.hp@gmail.com</a></p>
            <p><strong>Fanpage:</strong> <a href="https://www.facebook.com/huongsen.nhakhach" target="_blank" rel="noopener noreferrer">
              https://www.facebook.com/huongsen.nhakhach
            </a></p>
          </div>
        </Col>

        {/* Right Column - Contact Form */}
        <Col md={6}>
          <p>Nếu bạn có thắc mắc hoặc vấn đề cần giúp đỡ, vui lòng điền vào form bên dưới, chúng tôi sẽ cố gắng giải đáp trong thời gian sớm nhất</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="message" className="mt-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-4">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
