import React from 'react';
import { Card, Button, Carousel, Container, Row, Col } from 'react-bootstrap';
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
import Foodtour from '../../assets/Ft-3-01.jpg';
import phodibo from '../../assets/phodibo.jpg';
import bdhp from '../../assets/bdhp.jpg';
import btbd from '../../assets/btbdds.jpg';
import hd from '../../assets/hd.jpg';
import doirong from '../../assets/doirong.jpg';
import vqgcb from '../../assets/vqgcb.jpg';
import phao from '../../assets/phao.jpg';
import viethai from '../../assets/viethai.jpg';

const TourIntro = () => {
  return (
    
    <Container className="mt-4">
        <p><a href="/">Trang chủ</a> / <a href="/tours">Kết nối tour du lịch Hải Phòng</a></p>
        {/* Carousel Section */}
        <section id="tour" >
        <Row className="mt-4">
            <Col md={12} className="text-center tour" >
              <h4>Kết nối tour tham quan</h4>
              <Carousel>
                <Carousel.Item>
                  <img className="d-block w-100" src={catba1} alt="Khám phá văn hóa địa phương" />
                  <Carousel.Caption>
                    <h5>Khám phá văn hóa địa phương</h5>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={haiphong1} alt="Khám phá văn hóa địa phương" />
                  <Carousel.Caption>
                    <h5>Khám phá văn hóa địa phương</h5>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={haiphong2} alt="Khám phá văn hóa địa phương" />
                  <Carousel.Caption>
                    <h5>Khám phá văn hóa địa phương</h5>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={doson4} alt="Khám phá văn hóa địa phương" />
                  <Carousel.Caption>
                    <h5>Khám phá văn hóa địa phương</h5>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={haiphong3} alt="Khám phá văn hóa địa phương" />
                  <Carousel.Caption>
                    <h5>Khám phá văn hóa địa phương</h5>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={catba2} alt="Khám phá văn hóa địa phương" />
                  <Carousel.Caption>
                    <h5>Khám phá văn hóa địa phương</h5>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
              <p>Chúng tôi cung cấp dịch vụ kết nối tour tham quan để khám phá vẻ đẹp địa phương.</p>
            </Col>
          </Row>
        </section>
      <br/>
      <Row className="mt-4 text-center">
        <h4 >Tour nội thành Hải Phòng</h4>
        <Col md={4}>
          <Card style={{padding: '10px', height: '510px'}}>
            <Card.Img variant="top" src={Foodtour}  style={{ height: '300px', objectFit: 'cover' }}/>
            <Card.Body>
              <Card.Title>Foodtour  Hải Phòng</Card.Title>
              <Card.Text>
                Du khách sẽ được trải nghiệm những món ăn đặc sắc, đậm đà hương vị của người dân Đất Cảng
              </Card.Text>
              <Button variant="primary" style={{marginTop: '10px'}}>Liên hệ</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{padding: '10px', height: '510px'}}>
            <Card.Img variant="top" src={bdhp}  style={{ height: '300px', objectFit: 'cover' }}/>
            <Card.Body>
              <Card.Title>Dạo quanh Hải Phòng</Card.Title>
              <Card.Text>
                Hải Phòng cũng có những điểm check-in vô cùng thơ mộng chờ các bạn khám phá 
              </Card.Text>
              <Button variant="primary" style={{marginTop: '10px'}}>Liên hệ</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{padding: '10px', height: '510px'}}>
            <Card.Img variant="top" src={phodibo}  style={{ height: '300px', objectFit: 'cover',marginTop: '10px'}}/>
            <Card.Body>
              <Card.Title>Phố đi bộ Quang Trung</Card.Title>
              <Card.Text>
                Không giống với phố đi bộ tại Hà Nội hay Hồ Chí Minh, phố đi bộ Quang Trung tại thành phố Hoa Phượng Đỏ hứa hẹn sẽ đem lại cho du khách những trải nghiệm thú vị
              </Card.Text>
              <Button variant="primary" style={{marginTop: '10px'}}>Liên hệ</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br/>
      <Row className="mt-4 text-center">
        <h4 >Tour vòng quanh Đồ Sơn</h4>
        <Col md={4}>
          <Card style={{padding: '10px', height: '510px'}}>
            <Card.Img variant="top" src={doirong}  style={{ height: '300px', objectFit: 'cover' }}/>
            <Card.Body>
              <Card.Title>Khu du lịch Đồi Rồng</Card.Title>
              <Card.Text>
                Hãy cùng trải nghiệm những dịch vụ, khu vui chơi tại khu du lịch Đồi Rồng
              </Card.Text>
              <Button variant="primary" style={{marginTop: '10px'}}>Liên hệ</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{padding: '10px', height: '510px'}}>
            <Card.Img variant="top" src={hd}  style={{ height: '300px', objectFit: 'cover' }}/>
            <Card.Body>
              <Card.Title>Khám phá đảo Hòn Dáu</Card.Title>
              <Card.Text>
                Ngoài những khu vui chơi, Đồ Sơn cũng có những địa điểm du lịch tâm linh giúp du khách bình an hơn.
              </Card.Text>
              <Button variant="primary" style={{marginTop: '10px'}}>Liên hệ</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{padding: '10px', height: '510px'}}>
            <Card.Img variant="top" src={btbd}  style={{ height: '300px', objectFit: 'cover' }}/>
            <Card.Body>
              <Card.Title>Dinh thự Bảo Đại</Card.Title>
              <Card.Text>
                Không chỉ Đà Lạt, Đồ Sơn cũng là một trong những địa điểm được vua Bảo Đại chọn đặt dinh thự của mình.
              </Card.Text>
              <Button variant="primary" style={{marginTop: '10px'}}>Liên hệ</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br/>
      <Row className="mt-4 text-center">
        <h4 >Tour nội thành Hải Phòng</h4>
        <Col md={4}>
          <Card style={{padding: '10px', height: '510px'}}>
            <Card.Img variant="top" src={vqgcb}  style={{ height: '300px', objectFit: 'cover' }}/>
            <Card.Body>
              <Card.Title>Vườn Quốc Gia Cát Bà</Card.Title>
              <Card.Text>
                Đắm chìm trong thiên nhiên hoang dã, cùng ngắm nhìn loài voọc Cát Bà - một trong những loài vật được đưa vào sách đỏ
              </Card.Text>
              <Button variant="primary" style={{marginTop: '10px'}}>Liên hệ</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{padding: '10px', height: '510px'}}>
            <Card.Img variant="top" src={viethai}  style={{ height: '300px', objectFit: 'cover' }}/>
            <Card.Body>
              <Card.Title>Làng chài cổ Việt Hải</Card.Title>
              <Card.Text>
                Gìn giữ được những nét văn hóa và kiến trúc cổ, làng chài Việt Hải là một trong những địa điểm thu hút rất nhiều khách quốc tế 
              </Card.Text>
              <Button variant="primary" style={{marginTop: '10px'}}>Liên hệ</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{padding: '10px', height: '510px'}}>
            <Card.Img variant="top" src={phao}  style={{ height: '300px', objectFit: 'cover',marginTop: '10px'}}/>
            <Card.Body>
              <Card.Title>Pháo thần công Cát Bà</Card.Title>
              <Card.Text>
                Cùng khám phá di tích lịch sử "Pháo thần công" nằm sâu bên trong đảo Cát Bà
              </Card.Text>
              <Button variant="primary" style={{marginTop: '10px'}}>Liên hệ</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br/>
    </Container>
  );
};

export default TourIntro;
