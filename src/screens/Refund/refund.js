import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const Refund = () => {
  const [formData, setFormData] = useState({
    bookingID: '',
    name: '',
    cccd: '',
    campus: 'Minh Khai'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Refund request submitted:', formData);
  };

  return (
    <Container className="mt-4">
      
      <h1> Yêu cầu hủy phòng - Hoàn tiền</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="bookingID">
          <Form.Label>Booking ID</Form.Label>
          <Form.Control
            type="text"
            name="bookingID"
            value={formData.bookingID}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="name" className="mt-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="cccd" className="mt-3">
          <Form.Label>CCCD</Form.Label>
          <Form.Control
            type="text"
            name="cccd"
            value={formData.cccd}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="campus" className="mt-3">
          <Form.Label>Campus</Form.Label>
          <Form.Select
            name="campus"
            value={formData.campus}
            onChange={handleChange}
          >
            <option value="Minh Khai">Minh Khai</option>
            <option value="Đồ Sơn">Đồ Sơn</option>
            <option value="Cát Bà">Cát Bà</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-4">
          Submit Refund Request
        </Button>
      </Form>
    </Container>
  );
};

export default Refund;
