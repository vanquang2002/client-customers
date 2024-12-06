import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './policy.css';
const Policy = () => {
  const navigate = useNavigate();

  const handleRefundClick = () => {
    navigate('/refund');
  };

  return (
    <Container className="mt-4">
      <h1>Chính Sách Của Chúng Tôi</h1>
      
      <h3>Chính Sách Đặt Phòng</h3>
      <p>Khách cần đặt phòng trước và cung cấp thông tin đầy đủ. Mọi thay đổi hoặc hủy phòng cần thực hiện ít nhất 24 giờ trước giờ nhận phòng để tránh phí hủy phòng.</p>
      
      <h3>Chính Sách Hủy Phòng</h3>
      <p>Hủy phòng  24 giờ trước ngày giờ nhận phòng sẽ được hoàn tiền tổng giá trị đặt phòng. Hủy phòng trong vòng 24h trước ngày nhận phòng sẽ bị tính phí 100%.</p>

      <h3>Chính Sách Thanh Toán</h3>
      <p>Khách sạn yêu cầu thanh toán đầy đủ tại thời điểm nhận phòng. Chúng tôi chấp nhận thanh toán qua tiền mặt, thẻ tín dụng và chuyển khoản ngân hàng.</p>

      <h3>Chính Sách Hoàn Tiền</h3>
      <p>Chúng tôi sẽ xem xét hoàn tiền trong trường hợp hủy phòng hợp lệ theo các quy định trên. Nếu bạn muốn yêu cầu hoàn tiền, vui lòng xem hướng dẫn và gửi yêu cầu bên dưới.</p>
      
  
      

    </Container>
  );
};

export default Policy;
