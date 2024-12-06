import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <Container>
        <Row>
          {/* Contact Information */}
          <Col md={4} className="mb-4">
            <h5>Nhà khách Hương Sen</h5>
            <p>Address: Số 16 Minh Khai, Hồng bàng - TP Hải Phòng</p>
            <p>Lễ tân cơ sở Minh Khai: 022 5374 5766</p>
            <p>Lễ tân cơ sở Đồ Sơn: 022 5386 6386</p>
            <p>Lễ tân cơ sở Cát Bà: 022 5388 7381</p>
            <p>Email: <a href="mailto:huongsen.16minhkhai.hp@gmail.com">huongsen.16minhkhai.hp@gmail.com</a></p>
            <p>Fanpage:
              <a href="https://www.facebook.com/huongsen.nhakhach" target="_blank" rel="noopener noreferrer">
                https://www.facebook.com/huongsen.nhakhach
              </a>
            </p>
          </Col>

          {/* Services Section */}
          <Col md={4} className="mb-4">
            <h5>Dịch vụ</h5>
            <ul className="list-unstyled">
              <li>Hội nghị</li>
              <li>Tiệc cưới</li>
              <li>Nhà hàng</li>
              <li>Đặt phòng</li>
              <li>Tổ chức sự kiện</li>
              <li>Dịch vụ khác</li>
            </ul>
          </Col>

          {/* Fanpage Section */}
          <Col md={4} className="mb-4">
            <h5>Bản đồ</h5>
            
            <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59659.71837244205!2d106.71243317900318!3d20.842509851568096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7af3d4b1503d%3A0x6d500a082648cd8a!2zTmjDoCBLaMOhY2ggSMawxqFuZyBTZW4!5e0!3m2!1svi!2s!4v1729608040022!5m2!1svi!2s"
        width="500"
        height="250"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
      ></iframe>
          </Col>
        </Row>
        <div className="text-center pt-4">
          <p>&copy; {new Date().getFullYear()} Nha khach Hương Sen. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;