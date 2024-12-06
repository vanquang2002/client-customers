import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../../utils/config";
import axios from "axios";
import logo from '../../assets/logo.png'; // Import ảnh từ thư mục src
import { BiLoaderCircle } from 'react-icons/bi';

const PaymentCancel = () => {


  const { bookingId } = useParams();
  const [message, setMessage] = useState('Processing your payment...');
  const [booking, setBooking] = useState(null);


  useEffect(() => {
    console.log(bookingId);
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`);
        setBooking(response.data);

      } catch (error) {
        console.error("Error fetching booking:", error.message);
        setMessage('Đơn của bạn đã không tồn tại');
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    const createCancel = async () => {
      if (!booking) return;

      console.log("Current booking status before payment:", booking.status); // Log trạng thái hiện tại

      try {


        const updateBookingResponse = await axios.delete(`${BASE_URL}/bookings/all/${booking._id}`);
        if (updateBookingResponse.data) {
          setMessage('Quý khách đã hủy đơn thành công');


        } else {
          setMessage('có lỗi, đơn đặt không tồn tại');
        }


      } catch (error) {
        console.error("Error creating payment:", error.message);
        console.error("API error:", error.response ? error.response.data : error.message);
        setMessage('Có vấn đề xảy ra khi hủy đơn');
      }
    };

    createCancel();
  }, [booking]);
  return (

    <div>

      <img src={logo} alt="Logo" style={{ width: '25%', height: 'auto', display: 'block', margin: '20px auto' }} />

      {message === '' ? (
        <div className='text-center mb-5'>
          <h1> <BiLoaderCircle className="loading-icon" style={{ marginRight: '10px', animation: 'spin 1s infinite linear' }} /></h1>

          <h3>
            Đang xử lý thanh toán của bạn, vui lòng chờ trong giây lát...
          </h3>
        </div>
      ) : (
        <div className='text-center mb-5'>

          <h1 dangerouslySetInnerHTML={{ __html: message }} />
          <br></br>
          <h3>Cảm ơn quý khách đã sử dụng dịch vụ</h3>
        </div>
      )}
    </div>


  );
};

export default PaymentCancel;
