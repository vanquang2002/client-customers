// FeedbackForm.js
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

function Feedback() {
  const [formData, setFormData] = useState({
    rate: '',
    email: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Feedback:', formData);
    // Handle form submission logic here (e.g., sending data to a server)
  };

  return (
    <Container style={{ maxWidth: '500px', marginTop: '20px' }}>
      <h2>Feedback Form</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="rate">
          <Form.Label>Rate Us</Form.Label>
          <Form.Control 
            as="select"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            required
          >
            <option value="">Select Rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="content">
          <Form.Label>Feedback Content</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            rows={4}
            placeholder="Your feedback"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit Feedback
        </Button>
      </Form>
    </Container>
  );
}

export default Feedback;
