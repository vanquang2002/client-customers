import React from 'react';
import { Container, Carousel, Card, Button, Row, Col } from 'react-bootstrap';
import Footer from '../../components/Footer/footer';
import Header from '../../components/Header/header';
import NavigationBar from '../../components/Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import './home.css';
import main from '../../assets/main.png';
import cs1 from '../../assets/cs1.jpg';
import cs2 from '../../assets/cs2.jpg';
import cs3 from '../../assets/cs3.jpg';
import serviceImg1 from '../../assets/ngu1.jpg';
import serviceImg2 from '../../assets/ngu2.jpg';
import serviceImg3 from '../../assets/ngu3.jpg';
import serviceImg4 from '../../assets/tiec.jpg';
import newsImg1 from '../../assets/ngu1.jpg'; 
import newsImg2 from '../../assets/ngu2.jpg';
import newsImg3 from '../../assets/ngu3.jpg';
import haiphong1 from '../../assets/haiphong1.jpg';
import haiphong2 from '../../assets/haiphong2.jpg';
import haiphong3 from '../../assets/haiphong3.jpg';
import catba1 from '../../assets/catba1.jpg';
import catba2 from '../../assets/catba2.jpg';
import catba3 from '../../assets/catba3.jpg';
import doson1 from '../../assets/doson1.jpg';
import doson2 from '../../assets/doson2.jpg';
import doson3 from '../../assets/doson3.jpg';
import doson4 from '../../assets/doson4.jpg';
import doson5 from '../../assets/doson5.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const handleCarouselClick = () => {
    navigate('/tours');
  };
  return (
    <>
      
     
      <div>
        <img src={main} alt="Banner" className="banner-image" />
      </div>

      {/* Giới thiệu Section */}
      <section id="about" className="py-5 text-center ">
        <Container>
          <h2>Giới thiệu</h2>
          <p>
Nhà khách Hương Sen tại Hải Phòng, tọa lạc tại địa chỉ 16 Minh Khai, đã trở thành một địa chỉ quen thuộc trong lĩnh vực lưu trú và nghỉ dưỡng. Được thành lập từ nhiều năm qua, Hương Sen không ngừng phát triển và khẳng định vị thế của mình bằng chất lượng dịch vụ vượt trội.
</p><p>
Một điểm đặc biệt dễ nhận thấy ở nhà khách Hương Sen là vị trí vô cùng thuận tiện. Nằm ngay trung tâm thành phố Hải Phòng, từ đây, du khách có thể dễ dàng di chuyển đến các địa điểm văn hóa, du lịch nổi tiếng trong thành phố, cũng như khám phá vẻ đẹp mộc mạc và đậm chất truyền thống của vùng đất cảng này. Hương Sen mang đến cho du khách trải nghiệm tuyệt vời, hòa quyện giữa không gian nghỉ dưỡng thoải mái và nhịp sống hiện đại, năng động của thành phố Hải Phòng.</p>
        </Container>
      </section>

      {/* Hệ thống nhà khách Section */}
      <section id="branches" className="py-5 text-center">
        <Container>
          <h3>Hệ thống nhà khách</h3> 
          <Row className="mt-4">
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src={cs1} />
                <Card.Body>
                  <Card.Title>Nhà khách Hương Sen cơ sở Minh Khai</Card.Title>
                  <Card.Text>Địa chỉ: 16 Minh Khai, Hồng Bàng, TP Hải Phòng.</Card.Text>
                  <Button variant="primary" onClick={() => navigate('/cs1')}>Chi tiết</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src={cs2} />
                <Card.Body>
                  <Card.Title>Trung tâm bồi dưỡng nghiệp vụ Hải Hà</Card.Title>
                  <Card.Text>Địa chỉ: 02 Lý Thánh Tông, phường Hải Sơn, Đồ Sơn, Hải Phòng</Card.Text>
                  <Button variant="primary" onClick={() => navigate('/cs2')}>Chi tiết</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src={cs3} />
                <Card.Body>
                  <Card.Title>Nhà khách Hương Sen cơ sở Cát Bà</Card.Title>
                  <Card.Text>Địa chỉ: đường Núi Ngọc, thị trấn Cát Bà, Cát Hải, Hải Phòng</Card.Text>
                  <Button variant="primary" onClick={() => navigate('/cs3')}>Chi tiết</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Dịch vụ cung cấp Section */}
      <section id="services" className="py-5 bg-light text-center">
        <Container>
          <h3 >Dịch vụ cung cấp</h3>
          <Row className="mt-4">
            <Col md={6} className="text-center">
              <h4>Phòng ngủ</h4>
              <Carousel>
                <Carousel.Item>
                  <img className="d-block w-100" src={serviceImg1} alt="Phòng ngủ hiện đại" />
                  <Carousel.Caption>
                    <h5>Phòng ngủ hiện đại</h5>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={serviceImg2} alt="Phòng ngủ tiện nghi" />
                  <Carousel.Caption>
                    <h5>Phòng ngủ tiện nghi</h5>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
              <p>Chúng tôi cung cấp nhiều loại phòng với tiện nghi hiện đại.</p>
            </Col>
            <Col md={6} className="text-center">
              <h4>Tiệc & Hội nghị</h4>
              <Carousel>
                <Carousel.Item>
                  <img className="d-block w-100" src={serviceImg3} alt="Tiệc cưới sang trọng" />
                  <Carousel.Caption>
                    <h5>Tiệc cưới sang trọng</h5>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={serviceImg4} alt="Hội nghị chuyên nghiệp" />
                  <Carousel.Caption>
                    <h5>Hội nghị chuyên nghiệp</h5>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
              <p>Tổ chức tiệc cưới, hội nghị, sự kiện với dịch vụ chuyên nghiệp.</p>
            </Col>
          </Row>
          </Container>
      </section>

      {/* Tour Section */}
      <section id="tour" className="py-5">
        <Container>
          <Row className="mt-4">
            <Col md={12} className="text-center">
              <h4>Kết nối tour tham quan</h4>
              <Carousel>
      <Carousel.Item onClick={handleCarouselClick} style={{ cursor: 'pointer' }}>
        <img className="d-block w-100" src={catba1} alt="Khám phá văn hóa địa phương" />
        <Carousel.Caption>
          <h5>Khám phá văn hóa địa phương</h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item onClick={handleCarouselClick} style={{ cursor: 'pointer' }}>
        <img className="d-block w-100" src={haiphong1} alt="Khám phá văn hóa địa phương" />
        <Carousel.Caption>
          <h5>Khám phá văn hóa địa phương</h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item onClick={handleCarouselClick} style={{ cursor: 'pointer' }}>
        <img className="d-block w-100" src={haiphong2} alt="Khám phá văn hóa địa phương" />
        <Carousel.Caption>
          <h5>Khám phá văn hóa địa phương</h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item onClick={handleCarouselClick} style={{ cursor: 'pointer' }}>
        <img className="d-block w-100" src={doson4} alt="Khám phá văn hóa địa phương" />
        <Carousel.Caption>
          <h5>Khám phá văn hóa địa phương</h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item onClick={handleCarouselClick} style={{ cursor: 'pointer' }}>
        <img className="d-block w-100" src={haiphong3} alt="Khám phá văn hóa địa phương" />
        <Carousel.Caption>
          <h5>Khám phá văn hóa địa phương</h5>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item onClick={handleCarouselClick} style={{ cursor: 'pointer' }}>
        <img className="d-block w-100" src={catba2} alt="Khám phá văn hóa địa phương" />
        <Carousel.Caption>
          <h5>Khám phá văn hóa địa phương</h5>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
              <br/>
              <p>Chúng tôi cung cấp dịch vụ kết nối tour tham quan để khám phá vẻ đẹp địa phương.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Tin tức Section */}
      {/* <section id="news" className="py-5">
        <Container>
          <h2 className="text-center">Tin tức</h2>
          <Row className="mt-4">
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src={newsImg1} />
                <Card.Body>
                  <Card.Title>Tin tức 1</Card.Title>
                  <Card.Text>Huong Sen ra mắt chi nhánh mới tại Cát Bà.</Card.Text>
                  <Button variant="primary">Đọc thêm</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src={newsImg2} />
                <Card.Body>
                  <Card.Title>Tin tức 2</Card.Title>
                  <Card.Text>Sự kiện khai trương và các chương trình khuyến mãi.</Card.Text>
                  <Button variant="primary">Đọc thêm</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src={newsImg3} />
                <Card.Body>
                  <Card.Title>Tin tức 3</Card.Title>
                  <Card.Text>Cập nhật dịch vụ mới tại Huong Sen Guesthouse.</Card.Text>
                  <Button variant="primary">Đọc thêm</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section> */}

    </>
  );
}

export default HomePage;