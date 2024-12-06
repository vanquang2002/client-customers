import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import logo from '../../assets/logo.png'; // Import ảnh từ thư mục src
import { BiLoaderCircle } from 'react-icons/bi';


const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const [messageEmail, setMessageEmail] = useState('');
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/bookings/${bookingId}`);
        setBooking(response.data); // Giả sử response.data chứa thông tin đơn đặt

      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn đặt:", error.message);
        setMessage('Không tìm thấy đơn đặt.');
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    const confirmBooking = async () => {
      if (!booking) return;

      try {
        // Tạo thanh toán
        // const PayResponse = await axios.get(`http://localhost:9999/payment/booking/${bookingId}`);
        // console.log(PayResponse.data.success);
        // if (!PayResponse.data.success) {
        //   const paymentResponse = await axios.post(`http://localhost:9999/payment/create-payment`, {
        //     amount: booking.price,
        //     bookingId: booking._id,
        //     pending: 'pending'
        //   });
        //   await axios.put(`http://localhost:9999/bookings/${bookingId}`, { payment: booking.price });
        //   setMessage(paymentResponse.data.message || 'Thanh toán được tạo thành công.');
        // } else { setMessage('<h1>Thanh toán được tạo thành công.</h1>'); }
        const History = await axios.get(`http://localhost:9999/histories/booking/${bookingId}`);
        if (!History.data.success && History.data.success !== undefined) {
          await axios.put(`http://localhost:9999/bookings/${bookingId}`, { payment: booking.price });
          await axios.post('http://localhost:9999/histories/BE', { bookingId: bookingId, note: 'khách hàng đã đặt phòng ' });
        }
        setMessage('<h1>Thanh toán được tạo thành công.</h1>')

        // Xác nhận đặt phòng
        const response = await axios.get(`http://localhost:9999/payment/payment-success/${booking._id}`);
        setMessageEmail(response.data || 'Thanh toán thành công! Email xác nhận đã được gửi.');
      } catch (error) {
        console.error("Lỗi khi xác nhận đặt phòng hoặc tạo thanh toán:", error.message);
        setMessage('Đã xảy ra lỗi khi xử lý thanh toán của bạn.');
      }
    };

    confirmBooking();
  }, [booking]);

  return (
    <div>

      <img src={logo} alt="Logo" style={{ width: '25%', height: 'auto', display: 'block', margin: '20px auto' }} />

      {message === '' || messageEmail === '' ? (
        <div className='text-center mb-5'>
          <h1> <BiLoaderCircle className="loading-icon" style={{ marginRight: '10px', animation: 'spin 1s infinite linear' }} /></h1>

          <h3>
            Đang xử lý thanh toán của bạn, vui lòng chờ trong giây lát...
          </h3>
        </div>
      ) : (
        <div className='text-center mb-5'>

          <div dangerouslySetInnerHTML={{ __html: message }} />
          <div dangerouslySetInnerHTML={{ __html: messageEmail }} />
          <br></br>
          <h3>Cảm ơn quý khách đã sử dụng dịch vụ</h3>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
